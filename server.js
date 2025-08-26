// ===================================================================
// =================== ATLAS: ARQUITETURA DO BACKEND =================
// ===================================================================

// --- 1. IMPORTAÇÃO DE DEPENDÊNCIAS ---
// Ferramentas essenciais para o nosso servidor funcionar.
const express = require('express'); // Para criar o servidor e as rotas da API.
const mongoose = require('mongoose'); // Para conectar e interagir com o banco de dados MongoDB.
const cors = require('cors'); // Para permitir que nosso frontend (em outro endereço) se comunique com este backend.
const nodemailer = require('nodemailer'); // Para enviar os e-mails de notificação.

// --- 2. CONFIGURAÇÃO INICIAL ---
const app = express(); // Inicializa a aplicação Express.
const PORT = process.env.PORT || 3001; // Define a porta do servidor. Usa a porta do ambiente ou 3001 como padrão.

// --- 3. MIDDLEWARES ---
// Funções que preparam os "pedidos" (requests) que chegam na nossa API.
app.use(cors()); // Habilita o CORS para todas as rotas.
app.use(express.json()); // Permite que o servidor entenda JSON enviado no corpo das requisições.

// --- 4. CONEXÃO COM O BANCO DE DADOS ---
// A "despensa" onde guardaremos todos os nossos dados (imóveis, usuários, etc.).
// NOTA: A string de conexão abaixo é um exemplo. Ela precisará ser substituída pela URL do seu banco de dados MongoDB real.
const dbURI = 'mongodb+srv://victorhugn0diniz:tKYnRy83loZ087b6@cluster0.pzoluqq.mongodb.net/presence-imobiliaria?retryWrites=true&w=majority&appName=Cluster0';;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado com sucesso ao MongoDB.'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// --- 5. DEFINIÇÃO DOS "MOLDES" (SCHEMAS E MODELS) ---
// Define como os dados serão estruturados no banco de dados.

// Molde para os Imóveis
const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    purpose: { type: String, required: true },
    price: { type: Number, required: true },
    neighborhood: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    images: [String],
    longDescription: String,
    details: [String],
});
const Property = mongoose.model('Property', propertySchema);

// Molde para os Usuários (Clientes e Admins)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Em um projeto real, a senha seria criptografada (hashed).
    role: { type: String, default: 'client' } // 'client' ou 'admin'
});
const User = mongoose.model('User', userSchema);


// --- 6. ROTAS DA API (OS "PRATOS" DO NOSSO CARDÁPIO) ---
// Endereços que o frontend irá chamar para buscar, criar, editar ou deletar dados.

// ROTA PÚBLICA: Listar todos os imóveis
app.get('/api/properties', async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar imóveis.' });
    }
});

// --- ROTAS DE AUTENTICAÇÃO ---

// ROTA PÚBLICA: Registrar um novo cliente
app.post('/api/register', async (req, res) => {
    // Lógica para criar um novo usuário cliente no banco de dados.
    res.status(201).json({ message: 'Cliente registrado com sucesso!' });
});

// ROTA PÚBLICA: Fazer login (cliente ou admin)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    // Lógica para verificar o email e a senha.
    // Se o login for de um cliente, disparar a notificação por e-mail.
    console.log(`Tentativa de login para o e-mail: ${email}`);
    
    // Placeholder de sucesso
    res.json({ message: 'Login bem-sucedido!', token: 'um_token_jwt_seria_gerado_aqui' });
});


// --- ROTAS PROTEGIDAS (Apenas para Admins) ---
// Em um projeto real, teríamos um middleware para verificar o token de autenticação do admin.

// ROTA DE ADMIN: Criar um novo imóvel
app.post('/api/properties', async (req, res) => {
    // Lógica para adicionar um novo imóvel ao banco de dados.
    res.status(201).json({ message: 'Imóvel criado com sucesso!' });
});

// ROTA DE ADMIN: Atualizar um imóvel existente
app.put('/api/properties/:id', async (req, res) => {
    // Lógica para encontrar o imóvel pelo ID e atualizar seus dados.
    res.json({ message: `Imóvel com ID ${req.params.id} atualizado.` });
});

// ROTA DE ADMIN: Deletar um imóvel
app.delete('/api/properties/:id', async (req, res) => {
    // Lógica para encontrar o imóvel pelo ID e removê-lo.
    res.json({ message: `Imóvel com ID ${req.params.id} deletado.` });
});


// --- 7. INICIALIZAÇÃO DO SERVIDOR ---
// Liga o servidor para que ele comece a "ouvir" os pedidos do frontend.
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}. Acesse em http://localhost:${PORT}`);
});
