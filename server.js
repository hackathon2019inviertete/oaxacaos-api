'use strict'

// Importar dependencias
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const express = require('express')
const asyncify = require('express-asyncify')

// Configurar variables de entorno
if (!process.env.PRODUCTION) {
  dotenv.config()
}

// Crear app de express
const app = asyncify(express())

// Función para iniciar la aplicación
async function start () {
  try {
    // Conectarse a la base de datos
    mongoose.connect(process.env.DATABASE_URL)
    // Inicializar aplicación de vue
    app.listen(process.env.PORT || 3000, () => {
      console.log('Conexión a la base de datos establecida')
    })
  } catch (err) {
    console.log(`Ocurrió un error al conectarse a la base de datos: ${err}`)
  }
}

start()
