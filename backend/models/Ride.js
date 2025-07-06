const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  pickup_location: {
    type: String,
    required: true
  },
  drop_location: {
    type: String,
    required: true
  },
  ride_type: {
    type: String,
    enum: ['Bike', 'Car', 'Rickshaw'],
    required: true
  },
  status: {
    type: String,
    enum: ['Requested', 'Accepted', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Requested'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ride', rideSchema);
