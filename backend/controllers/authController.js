const bcrypt      = require('bcryptjs');
const db          = require('../config/firebase');
const { generateToken } = require('../utils/jwtUtils');

// Guard: return 503 when Firebase is not configured yet
const requireFirebase = (res) => {
  if (!db) {
    res.status(503).json({
      error: 'Database not configured yet.',
      hint:  'Add FIREBASE_SERVICE_ACCOUNT_JSON to your .env file, then restart the server.'
    });
    return false;
  }
  return true;
};

// Role → dashboard redirect map
const ROLE_REDIRECTS = {
  admin:      '/dashboard-admin.html',
  supervisor: '/dashboard-supervisor.html',
  client:     '/dashboard-client.html'
};

// ── REGISTER (Admin self-registers with company) ──────────────────────────
const register = async (req, res) => {
  if (!requireFirebase(res)) return;
  try {
    const { companyName, name, email, password } = req.body;

    if (!companyName || !name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check duplicate email across `users` collection
    const usersRef = db.collection('users');
    const emailCheckSnapshot = await usersRef.where('email', '==', normalizedEmail).get();
    
    if (!emailCheckSnapshot.empty) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Run in a transaction or individual writes
    // 1. Create tenant (company)
    const baseSlug = companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const slug     = `${baseSlug}-${Date.now()}`;

    const tenantRef = await db.collection('tenants').add({
      name: companyName,
      slug: slug,
      plan: 'starter',
      is_active: true,
      created_at: new Date().toISOString()
    });

    // 2. Create admin user
    const userRef = await usersRef.add({
      tenant_id: tenantRef.id,
      name: name.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
      role: 'admin',
      is_active: true,
      created_at: new Date().toISOString(),
      last_login_at: null
    });

    const token = generateToken({
      userId:   userRef.id,
      role:     'admin',
      tenantId: tenantRef.id
    });

    res.status(201).json({
      message:  'Account created successfully.',
      token,
      user:     { id: userRef.id, name: name.trim(), email: normalizedEmail, role: 'admin' },
      redirect: ROLE_REDIRECTS.admin
    });

  } catch (err) {
    console.error('[register]', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  if (!requireFirebase(res)) return;
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Fetch user
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', normalizedEmail).limit(1).get();

    if (snapshot.empty) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    if (!user.is_active) {
      return res.status(403).json({ error: 'Your account has been deactivated. Contact your admin.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken({
      userId:   userDoc.id,
      role:     user.role,
      tenantId: user.tenant_id
    });

    // Update last login timestamp
    await userDoc.ref.update({ last_login_at: new Date().toISOString() });

    res.json({
      message:  'Login successful.',
      token,
      user:     { id: userDoc.id, name: user.name, email: user.email, role: user.role },
      redirect: ROLE_REDIRECTS[user.role] || ROLE_REDIRECTS.admin
    });

  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// ── GET CURRENT USER ──────────────────────────────────────────────────────
const getMe = async (req, res) => {
  if (!requireFirebase(res)) return;
  try {
    const userDoc = await db.collection('users').doc(req.user.userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userData = userDoc.data();
    // remove sensitive info
    delete userData.password_hash;

    res.json({ user: { id: userDoc.id, ...userData } });

  } catch (err) {
    console.error('[getMe]', err);
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
};

// ── CREATE USER (Admin adds supervisors / clients) ─────────────────────────
const createUser = async (req, res) => {
  if (!requireFirebase(res)) return;
  try {
    const { name, email, password, role } = req.body;
    const { tenantId } = req.user;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'name, email, password, and role are required.' });
    }
    if (!['supervisor', 'client'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "supervisor" or "client".' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const snapshot = await db.collection('users').where('email', '==', normalizedEmail).get();

    if (!snapshot.empty) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = {
      tenant_id: tenantId,
      name: name.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
      role: role,
      is_active: true,
      created_at: new Date().toISOString()
    };

    const userRef = await db.collection('users').add(newUser);

    delete newUser.password_hash;

    res.status(201).json({ message: 'User created successfully.', user: { id: userRef.id, ...newUser } });

  } catch (err) {
    console.error('[createUser]', err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
};

// ── LIST USERS IN TENANT ──────────────────────────────────────────────────
const listUsers = async (req, res) => {
  if (!requireFirebase(res)) return;
  try {
    const { tenantId } = req.user;

    const snapshot = await db.collection('users')
      .where('tenant_id', '==', tenantId)
      .orderBy('created_at', 'desc')
      .get();

    const users = [];
    snapshot.forEach(doc => {
      const { password_hash, ...safeUser } = doc.data();
      users.push({ id: doc.id, ...safeUser });
    });

    res.json({ users });

  } catch (err) {
    console.error('[listUsers]', err);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

module.exports = { register, login, getMe, createUser, listUsers };
