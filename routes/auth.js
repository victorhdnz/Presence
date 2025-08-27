const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { notifyClientLogin } = require('../services/emailService');

const router = express.Router();

// ROTA PÚBLICA: Registrar um novo usuário
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Verificar se o usuário já existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'E-mail já cadastrado' });
        }

        // Criar novo usuário (aceita role do body ou usa 'client' como padrão)
        const user = new User({
            name,
            email,
            password,
            phone,
            role: role || 'client' // Aceita role do body ou usa 'client' como padrão
        });

        await user.save();

        // Gerar token JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'sua_chave_secreta_aqui',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// ROTA PÚBLICA: Fazer login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuário
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'E-mail ou senha incorretos' });
        }

        // Verificar senha
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'E-mail ou senha incorretos' });
        }

        // Verificar se o usuário está ativo
        if (!user.isActive) {
            return res.status(401).json({ message: 'Conta desativada' });
        }

        // Atualizar último login
        await user.updateLastLogin();

        // Gerar token JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'sua_chave_secreta_aqui',
            { expiresIn: '7d' }
        );

        // Se for cliente, notificar as corretoras
        if (user.role === 'client') {
            await notifyClientLogin(user.name, user.email);
        }

        res.json({
            message: 'Login bem-sucedido!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// ROTA PROTEGIDA: Obter perfil do usuário
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// ROTA PROTEGIDA: Atualizar perfil do usuário
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { name, phone } = req.body;
        
        const user = await User.findById(req.user._id);
        if (name) user.name = name;
        if (phone) user.phone = phone;
        
        await user.save();
        
        res.json({
            message: 'Perfil atualizado com sucesso!',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// ROTA ADMIN: Listar todos os usuários
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// ROTA ADMIN: Alterar status do usuário
router.patch('/users/:userId/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { isActive },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({
            message: `Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso!`,
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// ROTA ADMIN: Promover usuário para admin
router.patch('/users/:userId/promote', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { role: 'admin' },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({
            message: 'Usuário promovido para administrador com sucesso!',
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router;
