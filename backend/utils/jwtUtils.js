const jwt = require('jsonwebtoken');

const JWT_SECRET  = process.env.JWT_SECRET  || 'dev-placeholder-secret-change-me';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️   JWT_SECRET not set — using insecure placeholder. Set it in .env!');
}

/**
 * Generate a signed JWT
 * @param {Object} payload - { userId, role, tenantId }
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

/**
 * Verify and decode a JWT
 * @param {string} token
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
