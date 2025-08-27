const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar se o usuário está autenticado
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: 'Token de acesso necessário' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta_aqui');
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido' });
    }
};

// Middleware para verificar se o usuário é admin
const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Autenticação necessária' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Middleware para verificar se o usuário está logado (cliente ou admin)
const requireAuth = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Login necessário para acessar esta funcionalidade' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

module.exports = {
    authenticateToken,
    requireAdmin,
    requireAuth
};
