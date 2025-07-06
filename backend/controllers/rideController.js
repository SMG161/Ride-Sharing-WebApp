const Ride = require("../models/Ride");

exports.requestRide = async (req, res) => {
  try {
    const { pickup_location, drop_location, ride_type } = req.body;

    console.log(
      `Ride request from user: ${req.user.id}, Pickup: ${pickup_location}, Drop: ${drop_location}, Type: ${ride_type}\n`
    );

    if (!pickup_location || !drop_location || !ride_type) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newRide = await Ride.create({
      passenger: req.user.id,
      pickup_location,
      drop_location,
      ride_type,
    });

    console.log(
      `Ride requested successfully: ${newRide._id}, Passenger: ${req.user.id}\n`
    );
    res.status(201).json({
      message: "Ride requested successfully.",
      ride: newRide,
    });
  } catch (error) {
    console.error("Error requesting ride:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getRideStatus = async (req, res) => {
  try {
    const rideId = req.params.rideId;

    const ride = await Ride.findById(rideId).populate("passenger", "username");

    console.log(
      `Fetching ride status for ride ID: ${rideId}, Passenger: ${req.user.id}\n`
    );

    if (!ride) {
      return res.status(404).json({ message: "Ride not found." });
    }

    if (ride.passenger._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to view this ride." });
    }

    console.log(
      `Ride status fetched successfully: ${rideId}, Status: ${ride.status}\n`
    );

    res.status(200).json({
      rideId: ride._id,
      status: ride.status,
      ride_type: ride.ride_type,
      pickup_location: ride.pickup_location,
      drop_location: ride.drop_location,
    });
  } catch (error) {
    console.error("Error getting ride status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getRideHistory = async (req, res) => {
  try {

    console.log(`Fetching ride history for user: ${req.user.id}\n`);

    if (req.user.type !== "passenger") {
      return res
        .status(403)
        .json({ message: "Only passengers can view ride history." });
    }

    const rides = await Ride.find({ passenger: req.user.id })
      .sort({ createdAt: -1 })
      .select("pickup_location drop_location ride_type status createdAt");

    console.log(
      `Ride history fetched successfully for user: ${req.user.id}, Count: ${rides.length}\n`
    );
    res.status(200).json({ count: rides.length, rides });
  } catch (error) {
    console.error("Error getting ride history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
