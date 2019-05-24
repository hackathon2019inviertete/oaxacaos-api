'use strict'

//Importar dependencias
const mongoose = require('mongoose')

//Crear un esquema para el modelo administrador
const AdminSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  state: Number
})

//exportar el modelo
const Admin = mongoose.model('admin', AdminSchema)
module.exports = Admin
