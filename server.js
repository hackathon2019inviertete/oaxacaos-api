'use strict'

// Importar dependencias
const mongo = require('mongodb')
const dotenv = require('dotenv')
const express = require('express')
const asyncify = require('express-asyncify')

// Configurar variables de entorno
if (!process.env.PRODUCTION) {
    dotenv.config()
}

// Crear app de express
const app = asyncify(express())

