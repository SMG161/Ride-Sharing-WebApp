const User = require('../models/User');
const Driver = require('../models/Driver');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    try {
      const { username, password, type } = req.body;
      console.log(`Registration attempt for user: ${username}, Type: ${type}`);

      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: 'Username already taken.' });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hashedPassword, type });
  
      if (type === 'driver') {
        await Driver.create({ user: user._id });
      }

      console.log(`User registered: ${username}, Type: ${type}\n`);
      res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

  exports.login = async (req, res) => {
    try {
      const { username, password, type } = req.body;
  
      console.log(`Login attempt for user: ${username}`);
  
      const user = await User.findOne({ username });
      if (!user || (type && user.type !== type))
        return res.status(404).json({ message: 'User not found.' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });
  
      const token = jwt.sign({ id: user._id, type: user.type }, JWT_SECRET, {
        expiresIn: '1d',
      });
  
      if (user.type === 'driver') {
        await Driver.findOneAndUpdate(
          { user: user._id },
          { availability_status: 'available' },
        );
      }
  
      console.log(`User logged in: ${username}, Type: ${user.type}\n`);
  
      res.status(200).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          type: user.type
        }
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  