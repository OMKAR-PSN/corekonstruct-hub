const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('../middleware/authMiddleware');
const materialController = require('../controllers/materialController');

// All material routes require authentication
router.use(authenticate);

// ── Master Catalog (Tenant Level) ──────────────────────────────────────────
router.get('/catalog', materialController.getCatalog);
router.post('/catalog', authorize('admin'), materialController.addToCatalog);

// ── Site Inventory & Logging (Project Level) ───────────────────────────────
router.get('/project/:projectId/inventory', materialController.getSiteInventory);
router.post('/project/:projectId/log', authorize('admin', 'supervisor'), materialController.logMaterial);

module.exports = router;
