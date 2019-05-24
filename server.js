'use strict'

// Importar dependencias
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const asyncify = require('express-asyncify')

// Importar rutas
const AuthRouter = require('./routes/auth')

// Configurar variables de entorno
if (!process.env.PRODUCTION) {
  dotenv.config()
}

// Crear app de express
const app = asyncify(express())
app.use(bodyParser.json())

// Configurar rutas
app.use('/api/auth', AuthRouter)

// Configurar error handler
app.use((err, req, res, next) => {
  // Configurar el status del error
  res.status(err.status || 500)

  // Enviar el error como JSON
  res.json({
    error: err.message
  })
})

// Función para iniciar la aplicación
async function start() {
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
