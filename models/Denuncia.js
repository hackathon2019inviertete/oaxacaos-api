'use strict'

const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const DenunciaSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      required: true,
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  user_id: {
    type: {
      user_id: ObjectId,
      require: true
    }
  },
  record_audio_url: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    enum: [0, 1, 2], // 0: pendiente 1: en revisión 2: resuelto
    required: true,
    default: 0
  },
  address: {
    type: String,
    required: true
  }
},
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  })


// Método para obtener las denuncias cerca
DenunciaSchema.statics.findNearby = async function (latitude, longitude) {
  return Denuncia.find({
    location: {
      $near: {
        $maxDistance: 1000,
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      }
    }
  })
}


// Configurar index para la localización
DenunciaSchema.index({ location: "2dsphere" })

const Denuncia = mongoose.model('denuncia', DenunciaSchema)
module.exports = Denuncia
