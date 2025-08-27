// ===================================================================
// =================== ATLAS: ARQUITETURA DO BACKEND =================
// ===================================================================

// --- 0. CARREGAMENTO DE VARIÁVEIS DE AMBIENTE ---
require('dotenv').config();

// --- 1. IMPORTAÇÃO DE DEPENDÊNCIAS ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// --- 2. CONFIGURAÇÃO INICIAL ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- 3. MIDDLEWARES ---
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting para prevenir spam
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de 100 requests por IP
    message: 'Muitas requisições deste IP, tente novamente em 15 minutos.'
});
app.use('/api/', limiter);

// --- 4. CONEXÃO COM O BANCO DE DADOS ---
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/presence-imobiliaria';

// Debug: verificar se a variável está sendo carregada
console.log('MONGODB_URI configurada:', process.env.MONGODB_URI ? 'SIM' : 'NÃO');
console.log('String de conexão:', dbURI);

mongoose.connect(dbURI, {
    serverSelectionTimeoutMS: 10000, // Timeout de 10 segundos
    socketTimeoutMS: 45000, // Timeout do socket
})
.then(() => console.log('Conectado com sucesso ao MongoDB.'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// --- 5. ROTAS DA API ---
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ 
        message: 'Presence Imobiliária API funcionando!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// --- 6. INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}. Acesse em http://localhost:${PORT}`);
});
