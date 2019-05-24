'use strict'

// Importar dependencias
const express = require('express')
const jwt = require('express-jwt')
const auth = require('../helper/auth')
const Report = require('../models/Report')

// Crear Router de express
const router = express.Router()

// Ruta para crear un nuevo reporte
// Sólo los usuarios registrados pueden acceder a esta ruta
router.post('/', jwt(auth.config), async function (req, res, next) {
  // Obtener atributos
  const report_type = req.body.report_type
  const latitude = req.body.latitude
  const longitude = req.body.longitude
  const user_id = req.user.auth.id

  // Verificar que existan los datos
  if (report_type && latitude && longitude && user_id) {
    try {
      // Crear reporte
      const report = await Report.create({
        report_type,
        location: {
          latitude,
          longitude
        },
        user_id
      })

      // Enviar reporte al usuario
      res.send(report)
    } catch (err) {
      next(err)
    }
  } else {
    // Enviar un mensaje de error
    res.status(500).json({
      message: 'No pudimos completar la petición porque faltan datos.'
    })
  }
})

module.exports = router