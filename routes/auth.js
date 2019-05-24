'use strict'

// Importar dependencias
const express = require('express')
const User = require('../models/User')

// Crear router de express
const router = express.Router()

// Ruta para registrar a un usuario
router.post('/user', async function (req, res, next) {
  // Obtener atributos del request
  const email = req.body.email
  const password = req.body.password

  // Verificar que se encuentren los atributos
  if (email && password) {
    // Crear usuario
    const user = await User.create({
      email,
      password
    })

    // Regresar usuario
    res.send(user)
  } else {
    // Enviar mensaje de error al usuario
    res.status(500).send({
      message: 'No pudimos completar la petición porque faltan datos.'
    })
  }
})

module.exports = router
