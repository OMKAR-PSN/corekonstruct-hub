const db = require('../config/firebase');

const requireFirebase = (res) => {
  if (!db) {
    res.status(503).json({ error: 'Database not configured yet.' });
    return false;
  }
  return true;
};

// ── GET MATERIAL CATALOG FOR TENANT ──────────────────────────────────────
const getCatalog = async (req, res) => {
  if (!requireFirebase(res)) return;
  try {
    const { tenantId } = req.user;
    
    // In NoSQL, the catalog might be a master collection for a tenant
    const snapshot = await db.collection('material_catalog')
      .where('tenant_id', '==', tenantId)
      .get();
      
    const catalog = [];
    snapshot.forEach(doc => {
      catalog.push({ id: doc.id, ...doc.data() });
    });

    res.json({ catalog });
  } catch (err) {
    console.error('[getCatalog]', err);
    res.status(500).json({ error: 'Failed to fetch material catalog.' });
  }
};

// ── ADD TO CATALOG (Admin only) ──────────────────────────────────────────
const addToCatalog = async (req, res) => {
  if (!requireFirebase(res)) return;
  try {
    const { tenantId } = req.user;
    const { name, unit_of_measure, default_rate } = req.body;

    if (!name || !unit_of_measure) {
      return res.status(400).json({ error: 'Name and Unit of Measure are required.' });
    }

    const newItem = {
      tenant_id: tenantId,
      name: name.trim(),
      unit_of_measure: unit_of_measure.trim(),
      default_rate: default_rate ? parseFloat(default_rate) : 0,
      created_at: new Date().toISOString()
    };

    const docRef = await db.collection('material_catalog').add(newItem);

    res.status(201).json({ message: 'Material added to catalog.', item: { id: docRef.id, ...newItem } });
  } catch (err) {
    console.error('[addToCatalog]', err);
    res.status(500).json({ error: 'Failed to add material.' });
  }
};

// ── GET SITE INVENTORY ───────────────────────────────────────────────────
// This returns all inventory records for a specific project
const getSiteInventory = async (req, res) => {
  if (!requireFirebase(res)) return;
  try {
    const { projectId } = req.params;

    const snapshot = await db.collection(`projects/${projectId}/inventory`).get();
    
    const inventory = [];
    snapshot.forEach(doc => {
      inventory.push({ id: doc.id, ...doc.data() });
    });

    res.json({ inventory });
  } catch (err) {
    console.error('[getSiteInventory]', err);
    res.status(500).json({ error: 'Failed to fetch inventory.' });
  }
};

// ── LOG MATERIAL (Inward or Outward) ─────────────────────────────────────
const logMaterial = async (req, res) => {
  if (!requireFirebase(res)) return;
  try {
    const { projectId } = req.params;
    const { userId } = req.user; // the supervisor logging this
    const { material_id, type, quantity, reference_no, notes } = req.body;

    if (!material_id || !type || !quantity) {
      return res.status(400).json({ error: 'Material ID, type (inward/outward), and quantity are required.' });
    }

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number.' });
    }

    // 1. Create the log entry
    const newLog = {
      material_id,
      supervisor_id: userId,
      type, // 'inward' or 'outward'
      quantity: qty,
      reference_no: reference_no || '',
      log_date: new Date().toISOString(),
      notes: notes || '',
    };
    
    await db.collection(`projects/${projectId}/material_logs`).add(newLog);

    // 2. Update the site inventory counter
    const inventoryRef = db.collection(`projects/${projectId}/inventory`).doc(material_id);
    
    // We use a transaction to safely increment/decrement
    await db.runTransaction(async (transaction) => {
      const invDoc = await transaction.get(inventoryRef);
      let currentQty = 0;
      
      if (invDoc.exists) {
        currentQty = invDoc.data().quantity || 0;
      }

      const newQty = type === 'inward' ? currentQty + qty : currentQty - qty;

      if (newQty < 0) {
        throw new Error('Not enough inventory for outward log.');
      }

      transaction.set(inventoryRef, {
        quantity: newQty,
        last_updated: new Date().toISOString()
      }, { merge: true });
    });

    res.status(201).json({ message: `Material ${type} logged successfully.` });
  } catch (err) {
    console.error('[logMaterial]', err);
    
    if (err.message === 'Not enough inventory for outward log.') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to log material.' });
  }
};

module.exports = {
  getCatalog,
  addToCatalog,
  getSiteInventory,
  logMaterial
};
