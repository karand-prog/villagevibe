const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/user/profile - Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    // TODO: Get user profile from database
    res.json({ 
      message: 'User profile route working',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// PUT /api/user/profile - Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, avatar, preferences } = req.body;
    
    // TODO: Update user profile in database
    console.log('Profile update received:', { name, email, avatar, preferences });
    
    res.json({ 
      message: 'Profile updated successfully',
      profile: { name, email, avatar, preferences }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/user/settings - Get user settings
router.get('/settings', auth, async (req, res) => {
  try {
    // TODO: Get user settings from database
    res.json({ 
      message: 'User settings route working',
      settings: {
        notifications: true,
        language: 'en',
        theme: 'light'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user settings' });
  }
});

// PUT /api/user/settings - Update user settings
router.put('/settings', auth, async (req, res) => {
  try {
    const { notifications, language, theme } = req.body;
    
    // TODO: Update user settings in database
    console.log('Settings update received:', { notifications, language, theme });
    
    res.json({ 
      message: 'Settings updated successfully',
      settings: { notifications, language, theme }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router; 