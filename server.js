/**
 * CoreKonstruct — Production Express Server
 * Serves static frontend + REST API
 * Run: node server.js  |  Dev: npm run dev
 */

require('dotenv').config();

const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const rateLimit   = require('express-rate-limit');
const path        = require('path');

const authRoutes  = require('./backend/routes/authRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Security Headers ───────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,   // allow Google Fonts & Unsplash
  crossOriginEmbedderPolicy: false
}));

// ── CORS ───────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// ── Body Parsers ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Global Rate Limiter ────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' }
});
app.use('/api/', globalLimiter);

// ── Auth Rate Limiter (strict) ─────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please wait 15 minutes.' }
});

// ── API Routes ─────────────────────────────────────────────────────────────
const projectRoutes = require('./backend/routes/projectRoutes');
const materialRoutes = require('./backend/routes/materialRoutes');

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/materials', materialRoutes);

// ── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'CoreKonstruct API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ── 404 for unknown API routes ─────────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

// ── Serve Static Frontend ───────────────────────────────────────────────────
app.use(express.static(__dirname, {
  extensions: ['html'],
  index: 'index.html',
  dotfiles: 'ignore'
}));

// ── Catch-all → index.html ─────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Global Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n  ✅  CoreKonstruct Server running');
  console.log(`  🌐  Frontend : http://localhost:${PORT}`);
  console.log(`  🔌  API      : http://localhost:${PORT}/api`);
  console.log(`  💊  Health   : http://localhost:${PORT}/api/health\n`);
});
