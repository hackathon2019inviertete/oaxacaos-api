'use strict'

//Importar dependencias
const mongoose = require('mongoose')

//Crear un esquema para el modelo administrador
const AdminSchema = new mongoose.Schema({
  email:{
    type: String,
    require: true
  },

  password:{
    type: Number,
    require: true
  },

  name: {
    type: String,
    require: true
  },

  state: Number
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}
)

//exportar el modelo
const Admin = mongoose.model('admin', AdminSchema)
module.exports = Admin
