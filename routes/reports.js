'use strict'

// Importar dependencias
const express = require('express')
const jwt = require('express-jwt')
const auth = require('../helper/auth')
const guard = require('express-jwt-permissions')()
const Report = require('../models/Report')
const maps = require('@google/maps')
const Denuncia = require('../models/Denuncia')

// Crear Router de express
const router = express.Router()

// Configurar Google Maps
const mapsClient = maps.createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
})

// Actualizar el status de un reporte
// Sólo los administradores pueden acceder a esta ruta
router.post('/:id/status', jwt(auth.config), guard.check(['user:admin']), async function (req, res, next) {
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

// Obtener los reportes al rededor de un punto
// El resultado de los reportes varía si el usuario es administrador
router.get('/nearby', jwt(auth.config), async function (req, res, next) {
  // Obtener propiedades
  const latitude = req.query.latitude
  const longitude = req.query.longitude
  const userId = req.user.auth.id
  const permissions = req.user.permissions

  if (latitude, longitude, userId) {
    console.log('******************')
    console.log(req.user.permissions)
    console.log(latitude)
    console.log(longitude)
    console.log('******************')
    // Obtener reportes
    const reports = await Report.findNearby(latitude, longitude)
    // Obtener denuncias
    const denuncias = await Denuncia.findNearby(latitude, longitude)

    // Revisar si el usuario es normal o admin
    if (permissions[0] == 'user:normal') {
      // Enviar reportes
      res.send(reports)
    } else if (permissions[0] == 'user:admin') {
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

// Ruta para crear un nuevo reporte
// Sólo los usuarios registrados pueden acceder a esta ruta
router.post('/', jwt(auth.config), async function (req, res, next) {
  // Obtener atributos
  const report_type = req.body.report_type
  const latitude = req.body.latitude
  const longitude = req.body.longitude
  const user_id = req.user.auth.id

  console.log(report_type)
  console.log(latitude)
  console.log(longitude)
  console.log(user_id)

  // Verificar que existan los datos
  if (latitude && longitude && user_id) {
    let address

    // Generar dirección
    const response = await mapsClient.reverseGeocode({
      latlng: [parseFloat(latitude), parseFloat(longitude)]
    }).asPromise()

    address = response.json.results[0].formatted_address

    try {
      // Crear reporte
      const report = await Report.create({
        report_type,
        location: {
          coordinates: [longitude, latitude]
        },
        address,
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

// Obtener un reporte por su id
router.get('/:id', jwt(auth.config), async function (req, res, next) {
  try {
    const report = await Report.findById(req.params.id)
    res.send(report)
  } catch (err) {
    next(err)
  }
})

// Actualizar el número de likes
// Sólo los usuarios pueden acceder a esta ruta
router.get('/:id/update-likes', jwt(auth.config), guard.check(['user:normal']), async function (req, res, next) {
  // Obtener parámetros
  const userId = req.user.auth.id
  const reportId = req.params.id

  try {
    // Actualizar likes
    const result = await Report.updateLikes(userId, reportId)
    res.send(result)
  } catch (err) {
    next(err)
  }
})

module.exports = router