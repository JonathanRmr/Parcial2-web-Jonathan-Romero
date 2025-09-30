const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/login - Iniciar sesión
router.post('/login', authController.login.bind(authController));

// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get('/profile', authMiddleware, authController.getProfile.bind(authController));

module.exports = router;