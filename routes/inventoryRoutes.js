const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryControllers');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/inventory/movement - Crear movimiento de inventario (requiere autenticación)
router.post('/movement', authMiddleware, inventoryController.createMovement.bind(inventoryController));

// GET /api/inventory/movements - Obtener historial de movimientos (requiere autenticación)
router.get('/movements', authMiddleware, inventoryController.getMovements.bind(inventoryController));

module.exports = router;