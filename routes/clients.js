const express = require('express');
const router = express.Router();
const ClientProfile = require('../models/ClientProfile');
const { authenticateToken, requireAuth, requireAdmin } = require('../middleware/auth');

// GET: Listar todos os perfis de clientes (apenas admins)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { status, page = 1, limit = 20, search } = req.query;
        
        const filter = {};
        if (status && status !== 'todos') {
            filter.status = status;
        }
        
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const clients = await ClientProfile.find(filter)
            .populate('createdBy', 'name email')
            .populate('interactions.createdBy', 'name')
            .populate('interactions.propertyId', 'title neighborhood')
            .sort({ updatedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await ClientProfile.countDocuments(filter);

        res.json({
            clients,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Erro ao buscar perfis de clientes:', error);
        res.status(500).json({ message: 'Erro ao buscar perfis de clientes' });
    }
});

// GET: Buscar perfil de cliente por ID (apenas admins)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const client = await ClientProfile.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('interactions.createdBy', 'name')
            .populate('interactions.propertyId', 'title neighborhood price');

        if (!client) {
            return res.status(404).json({ message: 'Perfil de cliente não encontrado' });
        }

        res.json(client);
    } catch (error) {
        console.error('Erro ao buscar perfil de cliente:', error);
        res.status(500).json({ message: 'Erro ao buscar perfil de cliente' });
    }
});

// POST: Criar novo perfil de cliente (apenas admins)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            preferences,
            notes,
            status = 'ativo'
        } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Nome é obrigatório' });
        }

        // Verificar se já existe um cliente com o mesmo telefone ou email
        const existingClient = await ClientProfile.findOne({
            $or: [
                ...(phone ? [{ phone }] : []),
                ...(email ? [{ email }] : [])
            ]
        });

        if (existingClient) {
            return res.status(400).json({ 
                message: 'Já existe um cliente com este telefone ou email' 
            });
        }

        const client = new ClientProfile({
            name: name.trim(),
            phone: phone?.trim(),
            email: email?.trim(),
            preferences,
            notes: notes?.trim(),
            status,
            createdBy: req.user._id
        });

        await client.save();

        const populatedClient = await ClientProfile.findById(client._id)
            .populate('createdBy', 'name email');

        res.status(201).json(populatedClient);
    } catch (error) {
        console.error('Erro ao criar perfil de cliente:', error);
        res.status(500).json({ message: 'Erro ao criar perfil de cliente' });
    }
});

// PUT: Atualizar perfil de cliente (apenas admins)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            preferences,
            notes,
            status
        } = req.body;

        const client = await ClientProfile.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Perfil de cliente não encontrado' });
        }

        // Verificar se outro cliente já tem o mesmo telefone ou email
        if (phone || email) {
            const existingClient = await ClientProfile.findOne({
                $or: [
                    ...(phone ? [{ phone }] : []),
                    ...(email ? [{ email }] : [])
                ],
                _id: { $ne: req.params.id }
            });

            if (existingClient) {
                return res.status(400).json({ 
                    message: 'Já existe outro cliente com este telefone ou email' 
                });
            }
        }

        // Atualizar campos
        if (name) client.name = name.trim();
        if (phone !== undefined) client.phone = phone?.trim();
        if (email !== undefined) client.email = email?.trim();
        if (preferences) client.preferences = preferences;
        if (notes !== undefined) client.notes = notes?.trim();
        if (status) client.status = status;

        await client.save();

        const populatedClient = await ClientProfile.findById(client._id)
            .populate('createdBy', 'name email')
            .populate('interactions.createdBy', 'name')
            .populate('interactions.propertyId', 'title neighborhood price');

        res.json(populatedClient);
    } catch (error) {
        console.error('Erro ao atualizar perfil de cliente:', error);
        res.status(500).json({ message: 'Erro ao atualizar perfil de cliente' });
    }
});

// POST: Adicionar interação ao perfil do cliente (apenas admins)
router.post('/:id/interactions', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { type, notes, propertyId } = req.body;

        if (!type) {
            return res.status(400).json({ message: 'Tipo de interação é obrigatório' });
        }

        const client = await ClientProfile.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Perfil de cliente não encontrado' });
        }

        const interaction = {
            type,
            notes: notes?.trim(),
            propertyId: propertyId || undefined,
            createdBy: req.user._id
        };

        client.interactions.push(interaction);
        await client.save();

        const populatedClient = await ClientProfile.findById(client._id)
            .populate('interactions.createdBy', 'name')
            .populate('interactions.propertyId', 'title neighborhood');

        res.json(populatedClient);
    } catch (error) {
        console.error('Erro ao adicionar interação:', error);
        res.status(500).json({ message: 'Erro ao adicionar interação' });
    }
});

// DELETE: Remover interação (apenas admins)
router.delete('/:id/interactions/:interactionId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const client = await ClientProfile.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Perfil de cliente não encontrado' });
        }

        client.interactions = client.interactions.filter(
            interaction => interaction._id.toString() !== req.params.interactionId
        );

        await client.save();
        res.json(client);
    } catch (error) {
        console.error('Erro ao remover interação:', error);
        res.status(500).json({ message: 'Erro ao remover interação' });
    }
});

// DELETE: Excluir perfil de cliente (apenas admins)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const client = await ClientProfile.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Perfil de cliente não encontrado' });
        }

        await ClientProfile.findByIdAndDelete(req.params.id);
        res.json({ message: 'Perfil de cliente excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir perfil de cliente:', error);
        res.status(500).json({ message: 'Erro ao excluir perfil de cliente' });
    }
});

// GET: Estatísticas dos clientes (apenas admins)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const totalClients = await ClientProfile.countDocuments();
        const activeClients = await ClientProfile.countDocuments({ status: 'ativo' });
        const convertedClients = await ClientProfile.countDocuments({ status: 'convertido' });
        
        // Clientes criados nos últimos 30 dias
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentClients = await ClientProfile.countDocuments({ 
            createdAt: { $gte: thirtyDaysAgo } 
        });

        // Preferências mais comuns
        const preferenceStats = await ClientProfile.aggregate([
            { $unwind: '$preferences.propertyType' },
            { $group: { _id: '$preferences.propertyType', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            totalClients,
            activeClients,
            convertedClients,
            recentClients,
            preferenceStats
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ message: 'Erro ao buscar estatísticas' });
    }
});

module.exports = router;
