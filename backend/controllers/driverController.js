const Ride = require('../models/Ride');
const Driver = require('../models/Driver');

exports.viewRequestedRides = async (req, res) => {
  try {
    console.log(`Driver ${req.user.id} is viewing requested rides.\n`);
    if (req.user.type !== 'driver') {
      return res.status(403).json({ message: 'Access denied. Drivers only.' });
    }

    const rides = await Ride.find({ status: 'Requested' }).populate('_id', 'username');
    res.status(200).json({ rides });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.acceptRide = async (req, res) => {
    try {
        console.log(`Driver ${req.user.id} is accepting ride ${req.params.rideId}.`);
      if (req.user.type !== 'driver') {
        return res.status(403).json({ message: 'Access denied. Drivers only.' });
      }
  
      const driver = await Driver.findOne({ user: req.user.id });
      if (!driver || !driver.availability_status) {
        return res.status(400).json({ message: 'Driver not available or not found' });
      }
  
      const ride = await Ride.findById(req.params.rideId);
      if (!ride || ride.status !== 'Requested') {
        return res.status(400).json({ message: 'Ride not available for acceptance' });
      }
  
      ride.driver = driver._id;
      ride.status = 'Accepted';
      await ride.save();
  
      driver.availability_status = 'unavailable';
      await driver.save();
      console.log(`Ride ${ride._id} accepted by driver ${driver._id}.\n`);
      res.status(200).json({ message: 'Ride accepted', ride });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

  
  exports.endRide = async (req, res) => {
    try {
        console.log(`Driver ${req.user.id} is ending ride ${req.params.rideId}.`);
      if (req.user.type !== 'driver') {
        return res.status(403).json({ message: 'Access denied. Drivers only.' });
      }
  
      const driver = await Driver.findOne({ user: req.user.id });
      const ride = await Ride.findById(req.params.rideId);
  
      if (!ride || !driver || ride.driver.toString() !== driver._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized to end this ride' });
      }
  
      ride.status = 'Completed';
      await ride.save();
  
      driver.availability_status = "available";
      await driver.save();
      console.log(`Ride ${ride._id} marked as completed by driver ${driver._id}.\n`);
      res.status(200).json({ message: 'Ride marked as completed', ride });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  