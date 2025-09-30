const mongoose = require('mongoose');

const inventoryMovementSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: [true, 'El tipo de movimiento es requerido'],
            enum: ['entrada', 'salida']
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'El producto es requerido']
        },
        productName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: [true, 'La cantidad es requerida'],
            min: [1, 'La cantidad debe ser mayor a 0']
        },
        previousStock: {
            type: Number,
            required: true
        },
        newStock: {
            type: Number,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'El usuario es requerido']
        }
    },
    {
        timestamps: true
    }
);

// Índices
inventoryMovementSchema.index({ product: 1 });
inventoryMovementSchema.index({ user: 1 });
inventoryMovementSchema.index({ createdAt: -1 });

const InventoryMovement = mongoose.model('InventoryMovement', inventoryMovementSchema);

module.exports = InventoryMovement;