'use strict'

const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const ReportSchema = new mongoose.Schema({
  report_type: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3]
  },
  likes: {
    type: Number,
    required: true,
    default: 0
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
  status: {
    type: Number,
    enum: [0, 1, 2], // 0: pendiente 1: en revisión 2: resuelto
    required: true,
    default: 0
  }
},
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  })

// Configurar función para crear un usuario
ReportSchema.statics.create = async function (reportData) {
  const createdReport = new Report(reportData)
  return createdReport.save()
}

ReportSchema.statics.findNearby = async function (latitude, longitude) {
  return Report.find({
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

ReportSchema.statics.updateStatus = async function (reportId, newStatus) {
  return Report.update({ _id: reportId }, { status: newStatus })
}

// Configurar index para la localización
ReportSchema.index({ location: "2dsphere" })

const Report = mongoose.model('report', ReportSchema)
module.exports = Report
