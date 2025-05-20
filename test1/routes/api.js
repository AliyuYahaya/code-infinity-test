const express = require('express'); 
const router = express.Router();
const User = require('../models/User');

// ================================ [POST METHOD] ================================ //
router.post('/users', async (req, res) => {
  try {
    const { id } = req.body;

    // ================================ [CHECKS DB IF id IS PRESENT ALREADY] ================================ //
    const existing = await User.findOne({ id });
    if (existing) {
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
    console.error('Couldnt save  user:', err.message);
    res.status(400).json({
      error: true,
      message: 'Something went wrong, try again later.'
    });
  }
});
// ================================ [EoM] ================================ //


module.exports = router;
// ================================ [EoF] ================================ //

