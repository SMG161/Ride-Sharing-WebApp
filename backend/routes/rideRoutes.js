const express = require('express');
const router = express.Router();

const { requestRide, getRideStatus, getRideHistory } = require('../controllers/rideController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/request', authMiddleware, requestRide);
router.get('/:rideId/status', authMiddleware, getRideStatus);
router.get('/history', authMiddleware, getRideHistory);

module.exports = router;
