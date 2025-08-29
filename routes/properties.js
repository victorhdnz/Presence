const express = require('express');
const Property = require('../models/Property');
const { authenticateToken, requireAdmin, requireAuth } = require('../middleware/auth');
const { notifyPropertySubmission } = require('../services/emailService');

const router = express.Router();

// ROTA PÚBLICA: Listar todos os imóveis ativos
router.get('/', async (req, res) => {
    try {
        const { purpose, neighborhood, minPrice, maxPrice, bedrooms } = req.query;
        
        let filter = { status: 'ativo' };
        
        if (purpose) filter.purpose = purpose;
        if (neighborhood) filter.neighborhood = { $regex: neighborhood, $options: 'i' };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
        
        const properties = await Property.find(filter)
            .populate('submittedBy', 'name email')
            .sort({ isHighlighted: -1, createdAt: -1 });

        console.log(`Encontrados ${properties.length} imóveis ativos`);
        if (properties.length > 0) {
            console.log('Primeiro imóvel - Imagens:', properties[0].images);
            console.log('Primeiro imóvel - Corretor:', properties[0].corretor);
        }
            
        res.json(properties);
    } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
        res.status(500).json({ message: 'Erro ao buscar imóveis' });
    }
});

// ROTA PÚBLICA: Obter imóvel específico
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('submittedBy', 'name email phone')
            .populate('approvedBy', 'name');
            
        if (!property) {
            return res.status(404).json({ message: 'Imóvel não encontrado' });
        }

        console.log(`Imóvel ${req.params.id} - Imagens:`, property.images);
        console.log(`Imóvel ${req.params.id} - Corretor:`, property.corretor);
        
        res.json(property);
    } catch (error) {
        console.error('Erro ao buscar imóvel específico:', error);
        res.status(500).json({ message: 'Erro ao buscar imóvel' });
    }
});

// ROTA PROTEGIDA: Cliente cadastrar imóvel
router.post('/submit', authenticateToken, requireAuth, async (req, res) => {
    try {
        const {
            title, purpose, price, neighborhood, address,
            bedrooms, bathrooms, parkingSpaces, landSize, totalArea,
            longDescription, details, features, corretor
        } = req.body;

        // Criar novo imóvel
        const property = new Property({
            title,
            purpose,
            price,
            neighborhood,
            address,
            bedrooms,
            bathrooms,
            parkingSpaces,
            landSize,
            totalArea,
            longDescription,
            details,
            features,
            corretor,
            submittedBy: req.user._id,
            status: 'inativo' // Aguardando aprovação do admin
        });

        await property.save();

        // Notificar as corretoras
        await notifyPropertySubmission(req.user.name, req.user.email, property);

        res.status(201).json({
            message: 'Imóvel cadastrado com sucesso! Aguardando aprovação.',
            property
        });
    } catch (error) {
        console.error('Erro ao cadastrar imóvel:', error);
        res.status(500).json({ message: 'Erro ao cadastrar imóvel' });
    }
});

// ROTA ADMIN: Criar imóvel (admin)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        console.log('Dados recebidos para criar imóvel:', req.body);
        console.log('Imagens recebidas:', req.body.images);

        const property = new Property({
            ...req.body,
            submittedBy: req.user._id,
            status: 'ativo',
            approvedBy: req.user._id,
            approvedAt: new Date()
        });

        await property.save();
        console.log('Imóvel salvo com imagens:', property.images);

        res.status(201).json({
            message: 'Imóvel criado com sucesso!',
            property
        });
    } catch (error) {
        console.error('Erro ao criar imóvel:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errors.join(', ') });
        }
        res.status(500).json({ message: 'Erro ao criar imóvel' });
    }
});

// ROTA ADMIN: Atualizar imóvel
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );

        if (!property) {
            return res.status(404).json({ message: 'Imóvel não encontrado' });
        }

        res.json({
            message: 'Imóvel atualizado com sucesso!',
            property
        });
    } catch (error) {
        console.error('Erro ao atualizar imóvel:', error);
        res.status(500).json({ message: 'Erro ao atualizar imóvel' });
    }
});

// ROTA ADMIN: Aprovar/rejeitar imóvel
router.patch('/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { status, approved } = req.body;
        
        const updateData = { status };
        if (approved) {
            updateData.approvedBy = req.user._id;
            updateData.approvedAt = new Date();
        }

        const property = await Property.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!property) {
            return res.status(404).json({ message: 'Imóvel não encontrado' });
        }

        res.json({
            message: `Imóvel ${status === 'ativo' ? 'aprovado' : 'rejeitado'} com sucesso!`,
            property
        });
    } catch (error) {
        console.error('Erro ao aprovar imóvel:', error);
        res.status(500).json({ message: 'Erro ao aprovar imóvel' });
    }
});

// ROTA ADMIN: Deletar imóvel
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Imóvel não encontrado' });
        }

        res.json({ message: 'Imóvel deletado com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar imóvel:', error);
        res.status(500).json({ message: 'Erro ao deletar imóvel' });
    }
});

// ROTA ADMIN: Listar todos os imóveis (incluindo pendentes)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const properties = await Property.find()
            .populate('submittedBy', 'name email phone')
            .populate('approvedBy', 'name')
            .sort({ createdAt: -1 });
            
        res.json(properties);
    } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
        res.status(500).json({ message: 'Erro ao buscar imóveis' });
    }
});

// ROTA ADMIN: Destacar/desdestacar imóvel
router.patch('/:id/highlight', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { isHighlighted } = req.body;
        
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { isHighlighted },
            { new: true }
        );

        if (!property) {
            return res.status(404).json({ message: 'Imóvel não encontrado' });
        }

        res.json({
            message: `Imóvel ${isHighlighted ? 'destacado' : 'desdestacado'} com sucesso!`,
            property
        });
    } catch (error) {
        console.error('Erro ao destacar imóvel:', error);
        res.status(500).json({ message: 'Erro ao destacar imóvel' });
    }
});

module.exports = router;
