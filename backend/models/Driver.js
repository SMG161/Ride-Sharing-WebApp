const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  availability_status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'unavailable',
  },
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
