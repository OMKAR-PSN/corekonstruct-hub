/**
 * CoreKonstruct — Frontend Auth Helper
 * Handles login form submission, JWT storage, and session checks.
 */

const API_BASE = '/api';

// ── Token Helpers ─────────────────────────────────────────────────────────
const Auth = {
  setToken(token, user) {
    localStorage.setItem('ck_token', token);
    localStorage.setItem('ck_user',  JSON.stringify(user));
  },
  getToken() {
    return localStorage.getItem('ck_token');
  },
  getUser() {
    try { return JSON.parse(localStorage.getItem('ck_user')); } catch { return null; }
  },
  logout() {
    localStorage.removeItem('ck_token');
    localStorage.removeItem('ck_user');
    window.location.href = '/login.html';
  },
  isLoggedIn() {
    return !!this.getToken();
  },
  // Attach Bearer token to fetch requests
  headers() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    };
  }
};

// ── Login Page Logic ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Redirect already-logged-in users to their dashboard
  if (Auth.isLoggedIn()) {
    const user = Auth.getUser();
    const redirects = {
      admin:      '/dashboard-admin.html',
      supervisor: '/dashboard-supervisor.html',
      client:     '/dashboard-client.html'
    };
    window.location.href = redirects[user?.role] || '/dashboard-admin.html';
    return;
  }

  // ── Role Tab Switcher ──────────────────────────────────────────────────
  const roleTabs  = document.querySelectorAll('.role-tab');
  const demoHint  = document.getElementById('demo-hint');
  let   activeRole = 'admin';

  const demoCredentials = {
    admin:      'admin@corekonstruct.com / Admin@1234',
    supervisor: 'supervisor@corekonstruct.com / Admin@1234',
    client:     'client@corekonstruct.com / Admin@1234'
  };

  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      roleTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeRole = tab.dataset.role;
      if (demoHint) {
        demoHint.innerHTML = `Demo: <strong>${demoCredentials[activeRole]}</strong>`;
      }
      clearError();
    });
  });

  // ── Password Toggle ────────────────────────────────────────────────────
  const togglePw   = document.getElementById('toggle-pw');
  const pwInput    = document.getElementById('login-password');

  if (togglePw && pwInput) {
    togglePw.addEventListener('click', () => {
      const isText     = pwInput.type === 'text';
      pwInput.type     = isText ? 'password' : 'text';
      togglePw.textContent = isText ? '👁' : '🙈';
    });
  }

  // ── Error Display ──────────────────────────────────────────────────────
  const errorBox = document.getElementById('login-error');

  function showError(msg) {
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
  }

  function clearError() {
    if (!errorBox) return;
    errorBox.textContent = '';
    errorBox.style.display = 'none';
  }

  // ── Login Form Submit ──────────────────────────────────────────────────
  const form       = document.getElementById('login-form');
  const submitBtn  = document.getElementById('login-submit');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const email    = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;

    if (!email || !password) {
      return showError('Please enter your email and password.');
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Signing in…</span>';

    try {
      const res  = await fetch(`${API_BASE}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.error || 'Login failed. Please try again.');
        submitBtn.disabled   = false;
        submitBtn.innerHTML  = '<span>Sign In</span><span>→</span>';
        return;
      }

      // Store token & user, then redirect
      Auth.setToken(data.token, data.user);

      submitBtn.innerHTML = '<span>✓ Redirecting…</span>';
      window.location.href = data.redirect || '/dashboard-admin.html';

    } catch (err) {
      console.error('Login error:', err);
      showError('Network error. Make sure the server is running.');
      submitBtn.disabled  = false;
      submitBtn.innerHTML = '<span>Sign In</span><span>→</span>';
    }
  });

});

// ── Dashboard Guard (include this on every protected page) ──────────────────
// Call Auth.requireAuth('admin') at the top of each dashboard's script.
Auth.requireAuth = function(requiredRole) {
  if (!this.isLoggedIn()) {
    window.location.href = '/login.html';
    return null;
  }
  const user = this.getUser();
  if (requiredRole && user?.role !== requiredRole) {
    const redirects = {
      admin:      '/dashboard-admin.html',
      supervisor: '/dashboard-supervisor.html',
      client:     '/dashboard-client.html'
    };
    window.location.href = redirects[user?.role] || '/login.html';
    return null;
  }
  return user;
};

// Export for use in other scripts
window.Auth = Auth;
