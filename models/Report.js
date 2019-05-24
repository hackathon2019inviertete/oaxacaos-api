'use strict'

const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const ReportSchema = new mongoose.Schema({
  report_type: {
    type: Number,
    required: true
  },

  likes: {
    type: Number
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

const Report = mongoose.model('report', ReportSchema)
module.exports = Report
