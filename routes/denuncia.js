'use strict'

const express = require("express")
const router = express.Router()
const Denuncia = require('../models/Denuncia')

const jwt = require('express-jwt')
const auth = require('../helper/auth')
const guard = require('express-jwt-permissions')()

router.post('/', jwt(auth.config), guard.check(['user:normal']), async function (req, res) {
  // Obtener parámetros
  const latitude = req.body.latitude
  const longitude = req.body.longitude
  const audioUrl = req.body.audioUrl
  const userId = req.user.auth.id

  // Asegurarse de que existan los datos
  if (latitude && longitude && userId && audioUrl) {
    // Almacenar denuncia
    const storedDenuncia = await Denuncia.create({
      location: {
        coordinates: [longitude, latitude]
      },
      user_id: userId,
      record_audio_url: audioUrl
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