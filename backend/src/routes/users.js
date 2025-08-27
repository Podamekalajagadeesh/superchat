const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (for search)
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    // TODO: Implement user search
    res.json({ message: 'User search endpoint - coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
