require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdminUser = async () => {
    try {
        // Conectar ao MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/presence-imobiliaria');
        console.log('✅ Conectado ao MongoDB');

        // Verificar se o usuário Victor Hugo existe
        const existingUser = await User.findOne({ email: 'victorhugo10diniz@gmail.com' });
        if (existingUser) {
            // Atualizar para admin se não for
            if (existingUser.role !== 'admin') {
                existingUser.role = 'admin';
                await existingUser.save();
                console.log('✅ Usuário atualizado para administrador');
            } else {
                console.log('✅ Usuário já é administrador');
            }
            console.log(`Nome: ${existingUser.name}`);
            console.log(`E-mail: ${existingUser.email}`);
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
