const mongoose = require('mongoose');

const review = new mongoose.Schema({
  taskprovider: {
    type: String,
    required: true
  },
  taskproviderId: {
    type: String,
    default: ''
  },
  taskworker: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('review', review);