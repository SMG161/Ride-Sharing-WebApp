const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/requested-rides', driverController.viewRequestedRides);
router.post('/accept-ride/:rideId', driverController.acceptRide);
router.patch('/end-ride/:rideId', driverController.endRide);

module.exports = router;
