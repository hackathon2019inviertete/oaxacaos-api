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
  // Buscar si hay un usuario existente
  const foundUser = await User.findOne({ email: userData.email })

  if (foundUser) {
    throw new Error('Ya hay un usuario registrado con ese email.')
  } else {
    // Crear un nuevo usuario
    const createdUser = new User(userData)
    return createdUser.save()
  }
}

// Exportar modelo User
const User = mongoose.model('user', UserSchema)
module.exports = User
