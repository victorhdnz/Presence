const mongoose = require('mongoose');

const clientProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    // Preferências do cliente
    preferences: {
        propertyType: {
            type: [String],
            enum: ['casa', 'apartamento', 'terreno', 'comercial', 'rural'],
            default: []
        },
        purpose: {
            type: String,
            enum: ['venda', 'aluguel', 'ambos'],
            default: 'venda'
        },
        priceRange: {
            min: { type: Number, min: 0 },
            max: { type: Number, min: 0 }
        },
        neighborhoods: [String], // bairros de interesse
        bedrooms: {
            min: { type: Number, min: 0 },
            max: { type: Number, min: 0 }
        },
        features: [String] // características desejadas (piscina, garagem, etc.)
    },
    // Notas sobre o cliente
    notes: {
        type: String,
        trim: true
    },
    // Status do cliente
    status: {
        type: String,
        enum: ['ativo', 'inativo', 'convertido'],
        default: 'ativo'
    },
    // Histórico de interações
    interactions: [{
        date: { type: Date, default: Date.now },
        type: { type: String, enum: ['contato', 'visita', 'proposta', 'feedback'], required: true },
        notes: { type: String, trim: true },
        propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }, // imóvel relacionado
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    }],
    // Metadados
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
clientProfileSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Índices para melhor performance
clientProfileSchema.index({ name: 1 });
clientProfileSchema.index({ phone: 1 });
clientProfileSchema.index({ email: 1 });
clientProfileSchema.index({ status: 1 });
clientProfileSchema.index({ createdBy: 1 });

module.exports = mongoose.model('ClientProfile', clientProfileSchema);
