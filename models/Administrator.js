'use strict'

//Importar dependencias
const mongoose = require('mongoose')

//Crear un esquema para el modelo administrador
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true
  },

  password: {
    type: String,
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
  })

// Configurar función para crear un usuario administrador
AdminSchema.statics.create = async function (AdminData) {
  // Buscar si hay un administrador existente
  const foundAdmin = await Admin.findOne({ email: AdminData.email })

  if (foundAdmin) {
    throw new Error('Ya hay un usuario registrado con ese email.')
  } else {
    // Crear un nuevo usuario
    let createdAdmin = new Admin(AdminData)

    // Guardar usuario
    await createdAdmin.save()

    // Elimina contraseña
    delete createdAdmin._doc.password


    return createdAdmin._doc
  }
}

AdminSchema.statics.findByEmail = async function (email) {
  // Buscar si hay un usuario existente
  const foundAdmin = await Admin.findOne({ email })

  if (foundAdmin) {
    return foundAdmin
  } else {
    throw new Error('No exite un usuario registrado con ese email.')
  }
}


//exportar el modelo
const Admin = mongoose.model('admin', AdminSchema)
module.exports = Admin
