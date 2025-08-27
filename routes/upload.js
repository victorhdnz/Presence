const express = require('express');
const { upload, cloudinary } = require('../config/cloudinary');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ROTA PROTEGIDA: Upload de imagens (apenas admins)
router.post('/images', authenticateToken, requireAdmin, upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Nenhuma imagem foi enviada' });
        }

        const uploadedImages = req.files.map(file => ({
            url: file.path,
            publicId: file.filename,
            caption: req.body.caption || '',
            isMain: false
        }));

        // Se apenas uma imagem, marcar como principal
        if (uploadedImages.length === 1) {
            uploadedImages[0].isMain = true;
        }

        res.status(200).json({
            message: `${uploadedImages.length} imagem(ns) enviada(s) com sucesso!`,
            images: uploadedImages
        });

    } catch (error) {
        console.error('Erro no upload de imagens:', error);
        res.status(500).json({ message: 'Erro ao fazer upload das imagens' });
    }
});

// ROTA PROTEGIDA: Deletar imagem (apenas admins)
router.delete('/images/:publicId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { publicId } = req.params;

        // Deletar do Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            res.json({ message: 'Imagem deletada com sucesso!' });
        } else {
            res.status(400).json({ message: 'Erro ao deletar imagem' });
        }

    } catch (error) {
        console.error('Erro ao deletar imagem:', error);
        res.status(500).json({ message: 'Erro ao deletar imagem' });
    }
});

// ROTA PROTEGIDA: Marcar imagem como principal (apenas admins)
router.patch('/images/:publicId/main', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { publicId } = req.params;
        const { propertyId } = req.body;

        // Aqui você pode implementar a lógica para marcar a imagem como principal
        // no banco de dados do imóvel

        res.json({ message: 'Imagem marcada como principal!' });

    } catch (error) {
        console.error('Erro ao marcar imagem como principal:', error);
        res.status(500).json({ message: 'Erro ao marcar imagem como principal' });
    }
});

module.exports = router;
