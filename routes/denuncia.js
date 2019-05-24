'use strict'

const express = require("express")
const router = express.Router()
const upload = require('../helper/file-upload')
const Denuncia = require('../models/Denuncia')
const singleUpload = upload.single('image')

router.post('/file-upload', function(req, res) {
  singleUpload(req, res, function(err, some) {
    if (err) {
      return res.status(422).send({errors: [{title: 'Audio Upload Error', detail: err.message}] });
    }

    return res.json({'AudioUrl': req.file.location});
  });
})

module.exports = router;