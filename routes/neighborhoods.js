const express = require('express');
const router = express.Router();
const Neighborhood = require('../models/Neighborhood');
const { authenticateToken, requireAuth, requireAdmin } = require('../middleware/auth');

// GET: Listar todos os bairros
router.get('/', async (req, res) => {
    try {
        const neighborhoods = await Neighborhood.find({ isActive: true })
            .sort({ name: 1 });
        res.json(neighborhoods);
    } catch (error) {
        console.error('Erro ao buscar bairros:', error);
        res.status(500).json({ message: 'Erro ao buscar bairros' });
    }
});

// GET: Buscar bairro por ID
router.get('/:id', async (req, res) => {
    try {
        const neighborhood = await Neighborhood.findById(req.params.id);
        if (!neighborhood) {
            return res.status(404).json({ message: 'Bairro não encontrado' });
        }
        res.json(neighborhood);
    } catch (error) {
        console.error('Erro ao buscar bairro:', error);
        res.status(500).json({ message: 'Erro ao buscar bairro' });
    }
});

// POST: Criar novo bairro (apenas admins)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, streets = [] } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Nome do bairro é obrigatório' });
        }

        // Verificar se o bairro já existe
        const existingNeighborhood = await Neighborhood.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (existingNeighborhood) {
            return res.status(400).json({ message: 'Bairro já existe' });
        }

        const neighborhood = new Neighborhood({
            name: name.trim(),
            streets: streets.map(street => ({ name: street.name?.trim() })).filter(s => s.name)
        });

        await neighborhood.save();
        res.status(201).json(neighborhood);
    } catch (error) {
        console.error('Erro ao criar bairro:', error);
        res.status(500).json({ message: 'Erro ao criar bairro' });
    }
});

// PUT: Atualizar bairro (apenas admins)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, streets } = req.body;
        
        const neighborhood = await Neighborhood.findById(req.params.id);
        if (!neighborhood) {
            return res.status(404).json({ message: 'Bairro não encontrado' });
        }

        if (name) {
            // Verificar se outro bairro já tem esse nome
            const existingNeighborhood = await Neighborhood.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: req.params.id }
            });

            if (existingNeighborhood) {
                return res.status(400).json({ message: 'Já existe um bairro com esse nome' });
            }

            neighborhood.name = name.trim();
        }

        if (streets) {
            neighborhood.streets = streets.map(street => ({ name: street.name?.trim() })).filter(s => s.name);
        }

        await neighborhood.save();
        res.json(neighborhood);
    } catch (error) {
        console.error('Erro ao atualizar bairro:', error);
        res.status(500).json({ message: 'Erro ao atualizar bairro' });
    }
});

// POST: Adicionar rua a um bairro (apenas admins)
router.post('/:id/streets', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Nome da rua é obrigatório' });
        }

        const neighborhood = await Neighborhood.findById(req.params.id);
        if (!neighborhood) {
            return res.status(404).json({ message: 'Bairro não encontrado' });
        }

        // Verificar se a rua já existe neste bairro
        const existingStreet = neighborhood.streets.find(
            street => street.name.toLowerCase() === name.trim().toLowerCase()
        );

        if (existingStreet) {
            return res.status(400).json({ message: 'Rua já existe neste bairro' });
        }

        neighborhood.streets.push({ name: name.trim() });
        await neighborhood.save();

        res.json(neighborhood);
    } catch (error) {
        console.error('Erro ao adicionar rua:', error);
        res.status(500).json({ message: 'Erro ao adicionar rua' });
    }
});

// DELETE: Remover rua de um bairro (apenas admins)
router.delete('/:id/streets/:streetId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const neighborhood = await Neighborhood.findById(req.params.id);
        if (!neighborhood) {
            return res.status(404).json({ message: 'Bairro não encontrado' });
        }

        neighborhood.streets = neighborhood.streets.filter(
            street => street._id.toString() !== req.params.streetId
        );

        await neighborhood.save();
        res.json(neighborhood);
    } catch (error) {
        console.error('Erro ao remover rua:', error);
        res.status(500).json({ message: 'Erro ao remover rua' });
    }
});

// DELETE: Desativar bairro (apenas admins)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const neighborhood = await Neighborhood.findById(req.params.id);
        if (!neighborhood) {
            return res.status(404).json({ message: 'Bairro não encontrado' });
        }

        neighborhood.isActive = false;
        await neighborhood.save();

        res.json({ message: 'Bairro desativado com sucesso' });
    } catch (error) {
        console.error('Erro ao desativar bairro:', error);
        res.status(500).json({ message: 'Erro ao desativar bairro' });
    }
});

// POST: Buscar ou criar bairro automaticamente
router.post('/find-or-create', authenticateToken, async (req, res) => {
    try {
        const { name, streetName } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Nome do bairro é obrigatório' });
        }

        // Buscar bairro existente
        let neighborhood = await Neighborhood.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (!neighborhood) {
            // Criar novo bairro
            neighborhood = new Neighborhood({
                name: name.trim(),
                streets: streetName ? [{ name: streetName.trim() }] : []
            });
            await neighborhood.save();
        } else if (streetName) {
            // Verificar se a rua já existe
            const existingStreet = neighborhood.streets.find(
                street => street.name.toLowerCase() === streetName.trim().toLowerCase()
            );

            if (!existingStreet) {
                neighborhood.streets.push({ name: streetName.trim() });
                await neighborhood.save();
            }
        }

        res.json(neighborhood);
    } catch (error) {
        console.error('Erro ao buscar/criar bairro:', error);
        res.status(500).json({ message: 'Erro ao buscar/criar bairro' });
    }
});

module.exports = router;
