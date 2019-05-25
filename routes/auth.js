'use strict'

// Importar dependencias
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('express-jwt')
const auth = require('../helper/auth')
const guard = require('express-jwt-permissions')()
const User = require('../models/User')
const Admin = require('../models/Administrator')

// Crear router de express
const router = express.Router()

// Función para generar un token
function generateToken(id, permissions) {
  return auth.signToken({
    auth: {
      id
    },
    permissions
  }, auth.config.secret)
}

// Ruta para registrar a un usuario
router.post('/user/sign-up', async function (req, res, next) {
  // Obtener atributos del request
  const email = req.body.email
  const password = req.body.password

  // Verificar que se encuentren los atributos
  if (email && password) {
    try {
      // Crear usuario
      const user = await User.create({
        email,
        password: bcrypt.hashSync(password, 10)
      })

      // Crear token del usuario
      const token = generateToken(user._id, ['user:normal'])

      // Configurar token en el header
      res.setHeader('x-auth-token', token)

      // Regresar usuario
      res.send(user)
    } catch (err) {
      next(err)
    }
  } else {
    // Enviar mensaje de error al usuario
    res.status(500).json({
      message: 'No pudimos completar la petición porque faltan datos.'
    })
  }
})

// Ruta para iniciar sesión como usuario
router.post('/user/sign-in', async function (req, res, next) {
  // Obtener atributos del request
  const email = req.body.email
  const password = req.body.password

  // Verificar que se encuentren los atributos
  if (email && password) {
    try {
      // Obtener usuario
      const foundUser = await User.findByEmail(email)

      if (bcrypt.compareSync(password, foundUser.password)) {
        // Crear token del usuario
        const token = generateToken(foundUser._id, ['user:normal'])

        // Configurar token en el header
        res.setHeader('x-auth-token', token)

        // Regresar usuario
        delete foundUser._doc.password
        res.send(foundUser)
      } else {
        // Enviar un mensaje de error
        res.status(500).json({
          message: 'Contraseña incorrecta.'
        })
      }
    } catch (err) {
      next(err)
    }
  } else {
    // Enviar mensaje de error al usuario
    res.status(500).json({
      message: 'No pudimos completar la petición porque faltan datos.'
    })
  }
}),

  // Ruta para registrar a un administrador
  router.post('/admin/sign-up', async function (req, res, next) {
    // Obtener atributos del request
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    // Verificar que se encuentren los atributos
    if (email && password) {
      try {
        // Crear administrador
        const admin = await Admin.create({
          name,
          email,
          password: bcrypt.hashSync(password, 10)
        })

        // Crear token del admin
        const token = generateToken(admin._id, ['user:admin'])

        // Configurar token en el header
        res.setHeader('x-auth-token', token)

        // Regresar admin
        res.send(admin)
      } catch (err) {
        next(err)
      }
    } else {
      // Enviar mensaje de error al admin
      res.status(500).json({
        message: 'No pudimos completar la petición porque faltan datos.'
      })
    }
  }),

  // Ruta para iniciar sesión como admin
  router.post('/admin/sign-in', async function (req, res, next) {
    // Obtener atributos del request
    const email = req.body.email
    const password = req.body.password

    // Verificar que se encuentren los atributos
    if (email && password) {
      try {
        // Obtener admin
        const foundAdmin = await Admin.findByEmail(email)

        if (bcrypt.compareSync(password, foundAdmin.password)) {
          // Crear token del usuario
          const token = generateToken(foundAdmin._id, ['user:admin'])

          // Configurar token en el header
          res.setHeader('x-auth-token', token)

          // Regresar admin
          delete foundAdmin._doc.password
          res.send(foundAdmin)
        } else {
          // Enviar un mensaje de error
          res.status(500).json({
            message: 'Contraseña incorrecta.'
          })
        }
      } catch (err) {
        next(err)
      }
    } else {
      // Enviar mensaje de error al usuario
      res.status(500).json({
        message: 'No pudimos completar la petición porque faltan datos.'
      })
    }
  })

module.exports = router
