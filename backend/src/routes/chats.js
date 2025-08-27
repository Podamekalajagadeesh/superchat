const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/chats
// @desc    Get user's chats
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    // TODO: Implement chat retrieval
    res.json({ message: 'Chat retrieval endpoint - coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
