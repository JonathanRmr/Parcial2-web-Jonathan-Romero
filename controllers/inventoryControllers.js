const Product = require('../models/productModules');
const InventoryMovement = require('../models/inventoryModules');

class InventoryController {
    async createMovement(req, res) {
        try {
            const { type, productId, quantity } = req.body;
            const userId = req.user.id;

            // Validar datos requeridos
            if (!type || !productId || !quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo, productId y cantidad son requeridos'
                });
            }

            // Validar tipo de movimiento
            if (!['entrada', 'salida'].includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo de movimiento inválido. Debe ser "entrada" o "salida"'
                });
            }

            // Validar cantidad
            const qty = parseInt(quantity);
            if (qty <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'La cantidad debe ser mayor a 0'
                });
            }

            // Obtener producto
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            const previousStock = product.stock;
            let newStock;

            if (type === 'entrada') {
                newStock = previousStock + qty;
            } else {
                // Validar stock para salida
                newStock = previousStock - qty;

                if (newStock < product.minStock) {
                    return res.status(400).json({
                        success: false,
                        message: `Stock insuficiente. Stock actual: ${previousStock}, ` +
                            `Stock mínimo: ${product.minStock}, ` +
                            `Cantidad solicitada: ${qty}. ` +
                            `No se puede procesar la salida.`
                    });
                }
            }

            // Actualizar stock del producto
            product.stock = newStock;
            await product.save();

            // Crear registro de movimiento
            const movement = await InventoryMovement.create({
                type,
                product: productId,
                productName: product.name,
                quantity: qty,
                previousStock,
                newStock,
                user: userId
            });

            // Poblar datos relacionados
            await movement.populate('product', 'name category price');
            await movement.populate('user', 'name email');

            res.status(201).json({
                success: true,
                message: `Movimiento de ${type} procesado exitosamente`,
                data: {
                    movement,
                    product: await Product.findById(productId)
                }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getMovements(req, res) {
        try {
            const movements = await InventoryMovement.find()
                .populate('product', 'name category')
                .populate('user', 'name email')
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                count: movements.length,
                data: movements
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new InventoryController();