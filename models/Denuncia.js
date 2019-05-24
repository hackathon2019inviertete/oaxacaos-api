'use strict'

const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const DenunciaSchema = new mongoose.Schema({
  denuncia_type: {
    type: Number,
    required: true
  },
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
  }
},
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  })

const Report = mongoose.model('report', ReportSchema)
module.exports = Report
