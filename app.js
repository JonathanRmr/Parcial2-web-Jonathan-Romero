require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./drives/conect-db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: 'API de Gestión de Inventarios - Pet Shop',
        version: '1.0.0',
        database: 'MongoDB Atlas',
        endpoints: {
            auth: {
                login: 'POST /api/auth/login',
                profile: 'GET /api/auth/profile (requiere token)'
            },
            products: {
                getAll: 'GET /api/products',
                getById: 'GET /api/products/:id'
            },
            inventory: {
                createMovement: 'POST /api/inventory/movement (requiere token)',
                getMovements: 'GET /api/inventory/movements (requiere token)'
            }
        }
    });
});

// Manejador de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`API Pet Shop - Sistema de Inventarios iniciado en http://localhost:${PORT}`);
    console.log(`Base de datos: MongoDB Atlas`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Para crear usuarios usa el seed script`);
});
