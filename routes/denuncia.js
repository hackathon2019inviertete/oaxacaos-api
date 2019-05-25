'use strict'

const express = require("express")
const router = express.Router()
const maps = require('@google/maps')
const Denuncia = require('../models/Denuncia')

const jwt = require('express-jwt')
const auth = require('../helper/auth')
const guard = require('express-jwt-permissions')()

// Configurar Google Maps
const mapsClient = maps.createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
})


router.post('/', jwt(auth.config), guard.check(['user:normal']), async function (req, res) {
  // Obtener parámetros
  const latitude = req.body.latitude
  const longitude = req.body.longitude
  const audioUrl = req.body.audioUrl
  const userId = req.user.auth.id

  // Asegurarse de que existan los datos
  if (latitude && longitude && userId && audioUrl) {
    let address

    // Generar dirección
    const response = await mapsClient.reverseGeocode({
      latlng: [parseFloat(latitude), parseFloat(longitude)]
    }).asPromise()

    address = response.json.results[0].formatted_address

    // Almacenar denuncia
    const storedDenuncia = await Denuncia.create({
      location: {
        coordinates: [longitude, latitude]
      },
      user_id: userId,
      record_audio_url: audioUrl,
      address
    })

    res.send(storedDenuncia)
  } else {
    // Enviar mensaje de error al usuario
    res.status(500).json({
      message: 'No pudimos completar la petición porque faltan datos.'
    })
  }
})

module.exports = router;