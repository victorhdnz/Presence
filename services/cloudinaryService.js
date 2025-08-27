const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuração do Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuração do Multer com Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'presence-imobiliaria', // Pasta no Cloudinary
        allowed_formats: ['jpeg', 'jpg', 'png', 'webp'], // Formatos permitidos
        transformation: [
            { width: 1200, height: 800, crop: 'limit' }, // Redimensionar se muito grande
            { quality: 'auto:good' } // Otimização automática de qualidade
        ]
    },
});

// Configuração do upload
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Limite de 10MB por arquivo
    },
    fileFilter: (req, file, cb) => {
        // Verificar tipo de arquivo
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
        }
    }
});

module.exports = {
    upload,
    cloudinary
};
