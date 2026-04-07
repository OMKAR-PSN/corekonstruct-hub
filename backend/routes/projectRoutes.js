const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('../middleware/authMiddleware');
const projectController = require('../controllers/projectController');

// All project routes require authentication
router.use(authenticate);

// ── Projects ─────────────────────────────────────────────────────────────
router.get('/', projectController.getProjects);
router.post('/', authorize('admin'), projectController.createProject); // Only admin creates projects
router.get('/:id', projectController.getProjectById);

// ── Stages ───────────────────────────────────────────────────────────────
router.get('/:id/stages', projectController.getProjectStages);
router.post('/:id/stages', authorize('admin', 'supervisor'), projectController.addProjectStage);
router.patch('/:projectId/stages/:stageId/progress', authorize('admin', 'supervisor'), projectController.updateStageProgress);

module.exports = router;
