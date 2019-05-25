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
    type: [ObjectId],
    required: true,
    default: []
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
      required: true
    }
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
  try {
    // Actualizar reporte
    return Report.update({ _id: reportId }, { status: newStatus })
  } catch (err) {
    throw err
  }
}

ReportSchema.statics.updateLikes = async function (userId, reportId) {
  // Obtener reporte
  const report = await Report.findById(reportId)

  // Verificar que hay un reporte
  if (report) {
    let likes = report.likes

    // Eliminar likes del reporte
    report.likes = []
    await report.save()

    if (likes.indexOf(userId) !== -1) {
      // Eliminar like del usuario
      const likeIndex = likes.indexOf(userId)
      likes.splice(likeIndex, 1)
    } else {
      likes.push(userId)
    }

    // Reasignar grupos
    report.likes = likes
    const result = await report.save()

    return result.likes
  } else {
    throw new Error('El reporte buscado ya no existe')
  }
}

// Configurar index para la localización
ReportSchema.index({ location: "2dsphere" })

const Report = mongoose.model('report', ReportSchema)
module.exports = Report
