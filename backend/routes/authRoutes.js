const express    = require('express');
const router     = express.Router();

const { register, login, getMe, createUser, listUsers } = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// ── Public ─────────────────────────────────────────────────────────────────
router.post('/register', register);       // New company self-sign-up
router.post('/login',    login);          // Login → returns JWT

// ── Protected (any authenticated user) ────────────────────────────────────
router.get('/me', authenticate, getMe);  // Get own profile

// ── Admin only ─────────────────────────────────────────────────────────────
router.post('/users',  authenticate, authorize('admin'), createUser);   // Add supervisor/client
router.get('/users',   authenticate, authorize('admin'), listUsers);    // List all users in tenant

module.exports = router;
