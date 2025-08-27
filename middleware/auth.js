const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar se o usuário está autenticado
const authenticateToken = async (req, res, next) => {
    try {
        console.log('🔐 Middleware authenticateToken iniciado');
        
        const authHeader = req.headers['authorization'];
        console.log('📝 Auth header:', authHeader);
        
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        console.log('🎫 Token extraído:', token ? `${token.substring(0, 20)}...` : 'null');

        if (!token) {
            console.log('❌ Nenhum token fornecido');
            return res.status(401).json({ message: 'Token de acesso necessário' });
        }

        console.log('🔑 JWT_SECRET disponível:', process.env.JWT_SECRET ? 'SIM' : 'NÃO');
        console.log('🔑 JWT_SECRET valor:', process.env.JWT_SECRET ? `${process.env.JWT_SECRET.substring(0, 10)}...` : 'undefined');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta_aqui');
        console.log('✅ Token decodificado:', { userId: decoded.userId, role: decoded.role });
        
        const user = await User.findById(decoded.userId);
        console.log('👤 Usuário encontrado:', user ? { id: user._id, email: user.email, role: user.role } : 'null');

        if (!user) {
            console.log('❌ Usuário não encontrado no banco');
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        req.user = user;
        console.log('✅ req.user definido:', { id: req.user._id, role: req.user.role });
        next();
    } catch (error) {
        console.log('💥 Erro no authenticateToken:', error.message);
        return res.status(403).json({ message: 'Token inválido', error: error.message });
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
