const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true
    },
    purpose: { 
        type: String, 
        required: true,
        enum: ['venda', 'aluguel'],
        trim: true
    },
    price: { 
        type: Number, 
        required: true,
        min: 0
    },
    neighborhood: { 
        type: String, 
        required: true,
        trim: true
    },
    address: {
        street: String,
        number: String,
        complement: String,
        city: { type: String, default: 'Uberlândia' },
        state: { type: String, default: 'MG' },
        zipCode: String
    },
    bedrooms: { 
        type: Number, 
        required: true,
        min: 0
    },
    bathrooms: {
        type: Number,
        required: true,
        min: 0
    },
    parkingSpaces: {
        type: Number,
        default: 0,
        min: 0
    },
    landSize: {
        type: Number, // em m²
        min: 0
    },
    totalArea: {
        type: Number, // em m²
        min: 0
    },
    images: [{
        url: String,
        caption: String,
        isMain: { type: Boolean, default: false }
    }],
    longDescription: {
        type: String,
        trim: true
    },
    details: [String],
    features: [String], // características especiais
    status: {
        type: String,
        enum: ['ativo', 'inativo', 'rejeitado', 'vendido', 'alugado'],
        default: 'inativo'
    },
    isHighlighted: {
        type: Boolean,
        default: false
    },
    // Corretora responsável pelo imóvel
    corretor: {
        name: { type: String, required: true, enum: ['Helo', 'Vânia'] },
        whatsapp: { type: String, required: true },
        email: { type: String, required: true }
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Atualizar updatedAt antes de salvar
propertySchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Gerar link compartilhável
propertySchema.virtual('shareableLink').get(function() {
    return `${process.env.FRONTEND_URL || 'http://localhost:3000'}/imovel/${this._id}`;
});

// Gerar link do WhatsApp
propertySchema.virtual('whatsappLink').get(function() {
    if (this.corretor && this.corretor.whatsapp) {
        const phone = this.corretor.whatsapp.replace(/\D/g, '');
        const message = `Olá! Tenho interesse no imóvel: ${this.title} - ${this.neighborhood}`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    }
    return null;
});

// Configurar para incluir campos virtuais no JSON
propertySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Property', propertySchema);
