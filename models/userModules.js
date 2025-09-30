const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: 6,
        select: false
    },
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'employee'],
        default: 'employee'
    }
}, {
    timestamps: true
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Método para generar JWT
userSchema.methods.generateToken = function() {
    return jwt.sign(
        { 
            id: this._id, 
            email: this.email,
            role: this.role 
        },
        process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_2025',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};

// Métodos estáticos
userSchema.statics.authenticate = async function(email, password) {
    const user = await this.findOne({ email }).select('+password');
    
    if (!user) {
        throw new Error('Credenciales inválidas');
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
    }

    const token = user.generateToken();

    return {
        token,
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    };
};

const User = mongoose.model('User', userSchema);

module.exports = User;