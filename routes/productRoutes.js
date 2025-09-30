const express = require('express');
const router = express.Router();
const productController = require('../controllers/productControllers');

// GET /api/products - Obtener todos los productos (sin autenticación)
router.get('/', productController.getAll.bind(productController));

// GET /api/products/:id - Obtener producto por ID (sin autenticación)
router.get('/:id', productController.getById.bind(productController));

module.exports = router;