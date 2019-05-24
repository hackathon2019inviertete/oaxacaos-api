'use strict'

// Importar dependencias
const mongoose = require('mongoose')

// Crear Schema para el usuario
const UserSchema = new mongoose.Schema({
    email: String,
    password: String
})


// Exportar modelo User
const User = mongoose.model('user', UserSchema)
module.exports = User