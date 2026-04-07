const db = require('../config/firebase');

// Guard: return 503 when Firebase is not configured yet
const requireFirebase = (res) => {
  if (!db) {
    res.status(503).json({ error: 'Database not configured yet.' });
    return false;
  }
  return true;
};

// ── GET ALL PROJECTS FOR TENANT ──────────────────────────────────────────
const getProjects = async (req, res) => {
  if (!requireFirebase(res)) return;
  try {
    const { tenantId, role, userId } = req.user;

    let query = db.collection('projects').where('tenant_id', '==', tenantId);

    // If supervisor, only show assigned projects. If client, only show theirs.
    if (role === 'supervisor') {
      query = query.where('supervisor_id', '==', userId);
    } else if (role === 'client') {
      query = query.where('customer_id', '==', userId); // Assuming userId is linked to customer
    }

    const snapshot = await query.orderBy('created_at', 'desc').get();
    
    const projects = [];
    snapshot.forEach(doc => {
      projects.push({ id: doc.id, ...doc.data() });
    });

    res.json({ projects });
  } catch (err) {
    console.error('[getProjects]', err);
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
};

// ── GET SINGLE PROJECT ───────────────────────────────────────────────────
const getProjectById = async (req, res) => {
  if (!requireFirebase(res)) return;
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const doc = await db.collection('projects').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const project = { id: doc.id, ...doc.data() };

    // Tenant check
    if (project.tenant_id !== tenantId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.json({ project });
  } catch (err) {
    console.error('[getProjectById]', err);
    res.status(500).json({ error: 'Failed to fetch project.' });
  }
};

// ── CREATE PROJECT (Admin only) ──────────────────────────────────────────
const createProject = async (req, res) => {
  if (!requireFirebase(res)) return;
  try {
    const { tenantId } = req.user;
    const { name, type, location, budget, supervisor_id, customer_id, start_date, end_date, description } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Project name and type are required.' });
    }

    const newProject = {
      tenant_id: tenantId,
      name: name.trim(),
      type: type,
      location: location || '',
      budget: budget ? parseFloat(budget) : 0,
      supervisor_id: supervisor_id || null,
      customer_id: customer_id || null,
      status: 'active',
      progress: 0,
      start_date: start_date || null,
      end_date: end_date || null,
      description: description || '',
      created_at: new Date().toISOString()
    };

    const docRef = await db.collection('projects').add(newProject);

    res.status(201).json({ message: 'Project created.', project: { id: docRef.id, ...newProject } });
  } catch (err) {
    console.error('[createProject]', err);
    res.status(500).json({ error: 'Failed to create project.' });
  }
};

// ── GET PROJECT STAGES ───────────────────────────────────────────────────
const getProjectStages = async (req, res) => {
  if (!requireFirebase(res)) return;
  try {
    const { id } = req.params;

    const snapshot = await db.collection(`projects/${id}/stages`).orderBy('order_index', 'asc').get();
    
    const stages = [];
    snapshot.forEach(doc => {
      stages.push({ id: doc.id, ...doc.data() });
    });

    res.json({ stages });
  } catch (err) {
    console.error('[getProjectStages]', err);
    res.status(500).json({ error: 'Failed to fetch project stages.' });
  }
};

// ── ADD STAGE TO PROJECT ─────────────────────────────────────────────────
const addProjectStage = async (req, res) => {
  if (!requireFirebase(res)) return;
  try {
    const { id } = req.params;
    const { name, order_index } = req.body;

    if (!name) return res.status(400).json({ error: 'Stage name is required.' });

    const newStage = {
      name: name.trim(),
      order_index: parseInt(order_index) || 0,
      progress: 0,
      created_at: new Date().toISOString()
    };

    const docRef = await db.collection(`projects/${id}/stages`).add(newStage);

    res.status(201).json({ message: 'Stage added.', stage: { id: docRef.id, ...newStage } });
  } catch (err) {
    console.error('[addProjectStage]', err);
    res.status(500).json({ error: 'Failed to add stage.' });
  }
};

// ── UPDATE STAGE PROGRESS (Supervisor) ──────────────────────────────────
const updateStageProgress = async (req, res) => {
  if (!requireFirebase(res)) return;
  try {
    const { projectId, stageId } = req.params;
    const { progress } = req.body;

    const parsedProgress = parseInt(progress);
    if (isNaN(parsedProgress) || parsedProgress < 0 || parsedProgress > 100) {
      return res.status(400).json({ error: 'Progress must be between 0 and 100.' });
    }

    const stageRef = db.collection(`projects/${projectId}/stages`).doc(stageId);
    
    await stageRef.update({ 
      progress: parsedProgress,
      updated_at: new Date().toISOString()
    });

    // TODO: Write a background trigger or logic to recalculate total project progress based on stages

    res.json({ message: 'Stage progress updated.' });
  } catch (err) {
    console.error('[updateStageProgress]', err);
    res.status(500).json({ error: 'Failed to update progress.' });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  getProjectStages,
  addProjectStage,
  updateStageProgress
};
