'use strict'

// Importar dependencias
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const asyncify = require('express-asyncify')

// Configurar variables de entorno
if (!process.env.PRODUCTION) {
  dotenv.config()
}

// Crear app de express
const app = asyncify(express())

// Configuración de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token')
  res.header('Access-Control-Expose-Headers', 'x-auth-token')

  next()
})

// Configurar middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Importar rutas
const AuthRouter = require('./routes/auth')
const ReportsRouter = require('./routes/reports')
const DenunciasRouter = require('./routes/denuncia')

// Configurar rutas
app.use('/api/auth', AuthRouter)
app.use('/api/reports', ReportsRouter)
app.use('/api/denuncias', DenunciasRouter)

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
    await mongoose.connect(process.env.DATABASE_URL)

    const port = process.env.PORT || 3000

    // Inicializar aplicación de express
    app.listen(port, () => {
      console.log('Conexión a la base de datos establecida')
    })
  } catch (err) {
    console.log(`Ocurrió un error al conectarse a la base de datos: ${err}`)
  }
}

start()
