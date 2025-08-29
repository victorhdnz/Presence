const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { sendContactNotification } = require('../services/emailService');

// Rota para criar nova mensagem (pública)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validar campos obrigatórios
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: nome, email, assunto e mensagem' 
      });
    }

    // Criar nova mensagem
    const newMessage = new Message({
      name,
      email,
      phone,
      subject,
      message
    });

    await newMessage.save();

    // Enviar notificação por email para as corretoras
    try {
      await sendContactNotification(newMessage);
    } catch (emailError) {
      console.error('Erro ao enviar notificação por email:', emailError);
      // Não falhar se o email não for enviado
    }

    res.status(201).json({ 
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' 
    });
  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para listar todas as mensagens (apenas admin)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para atualizar status da mensagem (apenas admin)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, respondedBy } = req.body;

    if (!status || !respondedBy) {
      return res.status(400).json({ 
        error: 'Status e respondedBy são obrigatórios' 
      });
    }

    const updateData = {
      status,
      respondedBy,
      respondedAt: new Date()
    };

    const message = await Message.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }

    res.json(message);
  } catch (error) {
    console.error('Erro ao atualizar status da mensagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para deletar mensagem (apenas admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await Message.findByIdAndDelete(id);
    
    if (!message) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }

    res.json({ message: 'Mensagem deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar mensagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
