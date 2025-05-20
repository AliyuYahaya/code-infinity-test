const express = require('express'); 
const router = express.Router();
const User = require('../models/User');

// ================================ [GET ALL USERS - FOR DEBUGGING] ================================ //
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('id name surname');
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    console.error('Failed to fetch users:', err);
    res.status(500).json({
      error: true,
      message: 'Failed to fetch users.'
    });
  }
});
// ================================ [EoM] ================================ //

// ================================ [RESET DATABASE FOR TESTING - USE WITH CAUTION] ================================ //
router.delete('/reset-db', async (req, res) => {
  try {
    await User.deleteMany({});
    console.log('Database reset successfully');
    res.status(200).json({
      success: true,
      message: 'Database has been reset.'
    });
  } catch (err) {
    console.error('Failed to reset database:', err);
    res.status(500).json({
      error: true,
      message: 'Failed to reset database.'
    });
  }
});
// ================================ [EoM] ================================ //

// ================================ [POST METHOD] ================================ //
router.post('/users', async (req, res) => {
  try {
    const { id } = req.body;

    // ================================ [CHECKS DB IF id IS PRESENT ALREADY] ================================ //
    const existing = await User.findOne({ id });
    if (existing) {
      console.log(`Duplicate ID detected: ${id}`);
      return res.status(400).json({
        error: true,
        message: 'That ID number has already been use.'
      });
    }

    const user = new User(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User saved successfully!',
      user
    });
  } catch (err) {
    console.error('Couldnt save user. Error details:', err);
    
    // Handle duplicate key error specifically
    if (err.code === 11000) {
      console.log('MongoDB duplicate key error detected:', err.keyValue);
      return res.status(400).json({
        error: true,
        message: 'That ID number has already been use.'
      });
    }
    
    res.status(400).json({
      error: true,
      message: 'Something went wrong, try again later.'
    });
  }
});
// ================================ [EoM] ================================ //

module.exports = router;
// ================================ [EoF] ================================ //
