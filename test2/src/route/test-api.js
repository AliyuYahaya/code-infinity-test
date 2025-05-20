const express = require('express');
const router = express.Router();

console.log('Test API router loaded');

// Simple test route
router.get('/', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'API is working correctly' });
});

module.exports = router;
