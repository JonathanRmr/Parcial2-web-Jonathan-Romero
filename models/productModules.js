const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre del producto es requerido'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'La categoría es requerida'],
            enum: ['perros', 'gatos', 'higiene', 'juguetes', 'accesorios'],
            lowercase: true,
        },
        price: {
            type: Number,
            required: [true, 'El precio es requerido'],
            min: [0, 'El precio no puede ser negativo'],
        },
        stock: {
            type: Number,
            required: [true, 'El stock es requerido'],
            min: [0, 'El stock no puede ser negativo'],
            default: 0,
        },
        minStock: {
            type: Number,
            required: [true, 'El stock mínimo es requerido'],
            min: [0, 'El stock mínimo no puede ser negativo'],
            default: 5,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Índices
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;