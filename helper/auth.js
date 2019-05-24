'use strict'

// Importar dependencias
const jwt = require('jsonwebtoken')

// Firmar token
function signToken(payload, secret) {
    return jwt.sign(payload, secret)
}

const config = {
    secret: process.env.SECRET || 'oaxacaos',
    getToken: function (req) {
        const token = req.headers['x-auth-token']

        if (token) {
            return token
        } else {
            return null
        }
    }
}

module.exports = {
    signToken,
    config
}