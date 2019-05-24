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
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  user_id: {
    type: {
      user_id: ObjectId,
      require: true
    }
  },
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

const Report = mongoose.model('report', ReportSchema)
module.exports = Report
