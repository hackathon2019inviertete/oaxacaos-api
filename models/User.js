'use strict'

// Importar dependencias
const mongoose = require('mongoose')

// Crear Schema para el usuario
const UserSchema = new mongoose.Schema({
  email: String,
  password: String
})

// Configurar función para crear un usuario
UserSchema.statics.create = async function (userData) {
  const createdUser = new User(userData)
  return createdUser.save()
}

// Exportar modelo User
const User = mongoose.model('user', UserSchema)
module.exports = User
