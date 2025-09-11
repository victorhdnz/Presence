const mongoose = require('mongoose');

const neighborhoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    streets: [{
        name: {
            type: String,
            required: true,
            trim: true
        }
    }],
    city: {
        type: String,
        default: 'Uberlândia',
        trim: true
    },
    state: {
        type: String,
        default: 'MG',
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
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
neighborhoodSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Índices para melhor performance
neighborhoodSchema.index({ name: 1 });
neighborhoodSchema.index({ 'streets.name': 1 });

module.exports = mongoose.model('Neighborhood', neighborhoodSchema);
