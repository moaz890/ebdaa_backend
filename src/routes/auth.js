const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { login, getProfile, updateSettings } = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me (Protected)
router.get('/me', authMiddleware, getProfile);

// PUT /api/auth/settings (Protected)
router.put('/settings', authMiddleware, updateSettings);

module.exports = router;
