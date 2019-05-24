'use strict'

// Importar dependencias
const express = require('express')
const jwt = require('express-jwt')
const auth = require('../helper/auth')
const guard = require('express-jwt-permissions')()
const Report = require('../models/Report')
const Denuncia = require('../models/Denuncia')

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
          coordinates: [longitude, latitude]
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

// Obtener los reportes al rededor de un punto
// El resultado de los reportes varía si el usuario es administrador
router.get('/nearby', jwt(auth.config), async function (req, res, next) {
  // Obtener propiedades
  const latitude = req.query.latitude
  const longitude = req.query.longitude
  const userId = req.user.auth.id
  const permissions = req.user.permissions

  if (latitude, longitude, userId) {
    console.log(req.user.permissions)
    // Obtener reportes
    const reports = await Report.findNearby(latitude, longitude)
    // Obtener denuncias
    const denuncias = await Denuncia.findNearby(latitude, longitude)

    // Revisar si el usuario es normal o admin
    if (permissions[0] == 'user:normal') {
      // Enviar reportes
      res.send(reports)
    } else if (permissions[0] == 'admin:normal') {
      // Enviar reportes y denuncias
      res.send(reports.concat(denuncias))
    }
  } else {
    // Enviar mensaje de error al usuario
    res.status(500).json({
      message: 'No pudimos completar la petición porque faltan datos.'
    })
  }
})

// Actualizar el status de un reporte
// Sólo los administradores pueden acceder a esta ruta
router.post('/:id/update-status', jwt(auth.config), guard.check(['admin:normal']), async function (req, res, next) {
  // Obtener propiedades
  const newStatus = req.body.status

  if (newStatus) {
    try {
      // Actualizar y regresar reporte
      const result = await Report.updateStatus(req.params.id, newStatus)
      res.send(result)
    } catch (err) {
      res.next(err)
    }
  } else {
    // Enviar mensaje de error al usuario
    res.status(500).json({
      message: 'No pudimos completar la petición porque faltan datos.'
    })
  }
})

module.exports = router