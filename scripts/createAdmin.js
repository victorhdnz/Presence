require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdminUser = async () => {
    try {
        // Conectar ao MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/presence-imobiliaria');
        console.log('✅ Conectado ao MongoDB');

        // Verificar se já existe um admin
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('⚠️  Já existe um usuário administrador');
            console.log(`Nome: ${existingAdmin.name}`);
            console.log(`E-mail: ${existingAdmin.email}`);
            return;
        }

        // Criar usuário admin (Victor Hugo)
        const adminUser = new User({
            name: 'Victor Hugo',
            email: 'victorhugo10diniz@gmail.com', // Seu email
            password: 'admin1234', // Sua senha
            role: 'admin',
            phone: '(34) 99999-9999'
        });

        await adminUser.save();
        console.log('✅ Usuário administrador criado com sucesso!');
        console.log(`Nome: ${adminUser.name}`);
        console.log(`E-mail: ${adminUser.email}`);
        console.log(`Senha: admin1234`);
        console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
        console.log('🎯 Agora você pode fazer login e adicionar Helo e Vânia como admins!');

    } catch (error) {
        console.error('❌ Erro ao criar usuário admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado do MongoDB');
    }
};

// Executar o script
createAdminUser();
