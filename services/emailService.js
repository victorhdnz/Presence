const nodemailer = require('nodemailer');

// Configuração do transporter de e-mail (SendGrid)
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY // Usando a variável que já está no Render
    }
});

// E-mails das corretoras
const CORRETORAS_EMAILS = [
    'consultoriapresence@gmail.com'
];

// Função para enviar notificação de login de cliente
const notifyClientLogin = async (clientName, clientEmail) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: CORRETORAS_EMAILS.join(', '),
            subject: '🔔 Novo Cliente Acessou o Site - Presence Imobiliária',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">🔔 Notificação de Acesso</h2>
                    <p>Olá, corretoras!</p>
                    <p>Um cliente acabou de fazer login no site da Presence Imobiliária.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #34495e; margin-top: 0;">📋 Informações do Cliente:</h3>
                        <p><strong>Nome:</strong> ${clientName}</p>
                        <p><strong>E-mail:</strong> ${clientEmail}</p>
                        <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                    </div>
                    
                    <p>💡 <strong>Dica:</strong> Este é um momento ideal para fazer contato proativo com o cliente!</p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ecf0f1;">
                    <p style="color: #7f8c8d; font-size: 12px;">
                        Esta notificação foi enviada automaticamente pelo sistema da Presence Imobiliária.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Notificação de login enviada para as corretoras sobre ${clientName}`);
    } catch (error) {
        console.error('❌ Erro ao enviar notificação de login:', error);
    }
};

// Função para enviar notificação de cadastro de imóvel
const notifyPropertySubmission = async (clientName, clientEmail, propertyData) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: CORRETORAS_EMAILS.join(', '),
            subject: '🏠 Novo Imóvel Cadastrado pelo Cliente - Presence Imobiliária',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">🏠 Novo Imóvel Cadastrado</h2>
                    <p>Olá, corretoras!</p>
                    <p>Um cliente cadastrou um novo imóvel para anúncio no site da Presence Imobiliária.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #34495e; margin-top: 0;">👤 Informações do Cliente:</h3>
                        <p><strong>Nome:</strong> ${clientName}</p>
                        <p><strong>E-mail:</strong> ${clientEmail}</p>
                        
                        <h3 style="color: #34495e;">🏠 Dados do Imóvel:</h3>
                        <p><strong>Título:</strong> ${propertyData.title}</p>
                        <p><strong>Finalidade:</strong> ${propertyData.purpose}</p>
                        <p><strong>Preço:</strong> R$ ${propertyData.price?.toLocaleString('pt-BR') || 'A combinar'}</p>
                        <p><strong>Bairro:</strong> ${propertyData.neighborhood}</p>
                        <p><strong>Quartos:</strong> ${propertyData.bedrooms}</p>
                        <p><strong>Descrição:</strong> ${propertyData.longDescription || 'Não informado'}</p>
                        <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                    </div>
                    
                    <p>💡 <strong>Próximo passo:</strong> Analise os dados e entre em contato com o cliente para mais detalhes!</p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ecf0f1;">
                    <p style="color: #7f8c8d; font-size: 12px;">
                        Esta notificação foi enviada automaticamente pelo sistema da Presence Imobiliária.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Notificação de imóvel enviada para as corretoras sobre ${clientName}`);
    } catch (error) {
        console.error('❌ Erro ao enviar notificação de imóvel:', error);
    }
};

module.exports = {
    notifyClientLogin,
    notifyPropertySubmission
}; 
