/* ============================================================
   CORE KONSTRUCT — admin.js
   Admin/Contractor dashboard logic
   ============================================================ */

// ── Sample project data ───────────────────────────────────────
const PROJECTS_DATA = [
  {
    id: 1,
    name: 'City Center Complex',
    type: 'Building',
    location: 'Mumbai, MH',
    supervisor: 'Arjun Singh',
    budget: 4200000,
    spent: 2870000,
    labour: 980000,
    material: 1600000,
    misc: 290000,
    progress: 68,
    status: 'on-track',
    startDate: '2025-03-01',
    endDate: '2026-06-30',
    stages: [
      { name: 'Foundation',   pct: 100, status: 'done' },
      { name: 'Structure',    pct: 100, status: 'done' },
      { name: 'Brickwork',    pct: 85,  status: 'active' },
      { name: 'Plastering',   pct: 20,  status: 'pending' },
      { name: 'Finishing',    pct: 0,   status: 'pending' },
      { name: 'Handover',     pct: 0,   status: 'pending' }
    ],
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=600'
  },
  {
    id: 2,
    name: 'NH-48 Road Expansion',
    type: 'Road',
    location: 'Pune – Nashik Highway',
    supervisor: 'Arjun Singh',
    budget: 7500000,
    spent: 3100000,
    labour: 1200000,
    material: 1700000,
    misc: 200000,
    progress: 41,
    status: 'on-track',
    startDate: '2025-06-01',
    endDate: '2026-12-31',
    stages: [
      { name: 'Survey',     pct: 100, status: 'done' },
      { name: 'Earthwork',  pct: 100, status: 'done' },
      { name: 'Sub-base',   pct: 60,  status: 'active' },
      { name: 'Base Course',pct: 10,  status: 'pending' },
      { name: 'Surfacing',  pct: 0,   status: 'pending' }
    ],
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=600'
  },
  {
    id: 3,
    name: 'Residency Park Bridge',
    type: 'Bridge',
    location: 'Thane, MH',
    supervisor: 'Arjun Singh',
    budget: 9800000,
    spent: 8200000,
    labour: 3100000,
    material: 4500000,
    misc: 600000,
    progress: 84,
    status: 'delayed',
    startDate: '2024-09-01',
    endDate: '2026-03-31',
    stages: [
      { name: 'Piling',       pct: 100, status: 'done' },
      { name: 'Abutments',    pct: 100, status: 'done' },
      { name: 'Deck Slab',    pct: 100, status: 'done' },
      { name: 'Railings',     pct: 80,  status: 'active' },
      { name: 'Finishing',    pct: 30,  status: 'pending' }
    ],
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=600'
  }
];

// ── Chart-like finance visualization (pure CSS/JS) ────────────
function renderFinanceBar(el, pct, color) {
  if (!el) return;
  el.style.width = '0%';
  el.style.background = color;
  setTimeout(() => { el.style.width = pct + '%'; el.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)'; }, 200);
}

// ── Circular progress ring ────────────────────────────────────
function renderRing(svg, pct, strokeColor = '#F97316') {
  if (!svg) return;
  const size   = 120;
  const radius = 48;
  const circ   = 2 * Math.PI * radius;
  const offset = circ * (1 - pct / 100);

  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.innerHTML = `
    <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="#EEF2F7" stroke-width="10"/>
    <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="${strokeColor}" stroke-width="10"
      stroke-linecap="round"
      stroke-dasharray="${circ}"
      stroke-dashoffset="${circ}"
      style="transition: stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1); stroke-dashoffset:${offset}"/>
  `;
}

// ── Render stage tracker ──────────────────────────────────────
function renderStages(container, stages) {
  if (!container) return;
  container.innerHTML = stages.map((s, i) => `
    <div class="stage-step ${s.status}">
      <div class="stage-dot">${s.status === 'done' ? '✓' : i + 1}</div>
      <div class="stage-name">${s.name}</div>
      <div style="font-size:0.7rem;color:var(--text-muted)">${s.pct}%</div>
    </div>
  `).join('');
}

// ── Render project card list ──────────────────────────────────
function renderProjectList() {
  const list = document.getElementById('proj-list');
  if (!list) return;
  list.innerHTML = PROJECTS_DATA.map(p => `
    <div class="proj-item" data-id="${p.id}">
      <div class="proj-item-img" style="overflow:hidden;border-radius:var(--radius-sm);">
        <img src="${p.image}" style="width:52px;height:52px;object-fit:cover;" alt="${p.name}">
      </div>
      <div class="proj-item-info">
        <div class="name">${p.name}</div>
        <div class="meta">📍 ${p.location} &bull; 👷 ${p.supervisor}</div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${p.progress}%"></div>
        </div>
      </div>
      <div class="proj-item-right">
        <div class="pct">${p.progress}%</div>
        <div class="badge badge-${p.status === 'delayed' ? 'danger' : 'success'}">${p.status === 'delayed' ? '⚠ Delayed' : '✓ On Track'}</div>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.proj-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = parseInt(item.dataset.id);
      openProjectDetail(id);
    });
  });
}

// ── Stat counters ─────────────────────────────────────────────
function renderStats() {
  const total   = PROJECTS_DATA.length;
  const delayed = PROJECTS_DATA.filter(p => p.status === 'delayed').length;
  const avgProg = Math.round(PROJECTS_DATA.reduce((s, p) => s + p.progress, 0) / total);
  const totalBudget = PROJECTS_DATA.reduce((s, p) => s + p.budget, 0);

  setStatVal('stat-projects', total);
  setStatVal('stat-budget', '₹' + (totalBudget/100000).toFixed(0) + 'L');
  setStatVal('stat-progress', avgProg + '%');
  setStatVal('stat-delays', delayed);
}

function setStatVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── Project detail modal ──────────────────────────────────────
function openProjectDetail(id) {
  const p = PROJECTS_DATA.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  document.getElementById('pm-name').textContent     = p.name;
  document.getElementById('pm-type').textContent     = p.type;
  document.getElementById('pm-location').textContent = p.location;
  document.getElementById('pm-supervisor').textContent = p.supervisor;
  document.getElementById('pm-start').textContent    = p.startDate;
  document.getElementById('pm-end').textContent      = p.endDate;
  document.getElementById('pm-pct').textContent      = p.progress + '%';
  document.getElementById('pm-status').textContent   = p.status === 'delayed' ? '⚠ Delayed' : '✓ On Track';
  document.getElementById('pm-status').className     = 'badge badge-' + (p.status === 'delayed' ? 'danger' : 'success');

  // Finance rows
  const total = p.labour + p.material + p.misc;
  document.getElementById('pm-labour').textContent   = '₹' + p.labour.toLocaleString('en-IN');
  document.getElementById('pm-material').textContent = '₹' + p.material.toLocaleString('en-IN');
  document.getElementById('pm-misc').textContent     = '₹' + p.misc.toLocaleString('en-IN');
  document.getElementById('pm-spent').textContent    = '₹' + total.toLocaleString('en-IN');
  document.getElementById('pm-budget').textContent   = '₹' + p.budget.toLocaleString('en-IN');

  const budgetPct = Math.round((total / p.budget) * 100);
  const bFill = document.getElementById('pm-budget-fill');
  if (bFill) {
    bFill.style.width = budgetPct + '%';
    bFill.style.background = budgetPct > 90 ? 'var(--danger)' : budgetPct > 75 ? 'var(--warning)' : 'var(--success)';
  }

  // Finance bars
  renderFinanceBar(document.getElementById('pm-labour-bar'),   Math.round(p.labour   / total * 100), '#3B82F6');
  renderFinanceBar(document.getElementById('pm-material-bar'), Math.round(p.material / total * 100), '#F97316');
  renderFinanceBar(document.getElementById('pm-misc-bar'),     Math.round(p.misc     / total * 100), '#10B981');

  // Stages
  renderStages(document.getElementById('pm-stages'), p.stages);

  // Ring
  const ringSvg = document.getElementById('pm-ring');
  renderRing(ringSvg, p.progress);

  modal.classList.remove('hidden');
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) modal.classList.add('hidden');
}

// ── Create project (modal) ────────────────────────────────────
function openCreateModal() {
  const m = document.getElementById('create-modal');
  if (m) m.classList.remove('hidden');
}
function closeCreateModal() {
  const m = document.getElementById('create-modal');
  if (m) m.classList.add('hidden');
}

const createForm = document.getElementById('create-project-form');
if (createForm) {
  createForm.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(createForm);
    const newProj = {
      id: PROJECTS_DATA.length + 1,
      name:       fd.get('proj-name') || 'New Project',
      type:       fd.get('proj-type') || 'Building',
      location:   fd.get('proj-location') || 'TBD',
      supervisor: 'Arjun Singh',
      budget:     parseInt(fd.get('proj-budget')) || 0,
      spent: 0, labour: 0, material: 0, misc: 0,
      progress: 0,
      status: 'on-track',
      startDate: fd.get('proj-start') || '',
      endDate:   fd.get('proj-end') || '',
      stages: [
        { name: 'Planning',    pct: 0, status: 'active' },
        { name: 'Foundation',  pct: 0, status: 'pending' },
        { name: 'Structure',   pct: 0, status: 'pending' },
        { name: 'Finishing',   pct: 0, status: 'pending' },
        { name: 'Handover',    pct: 0, status: 'pending' }
      ],
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600'
    };
    PROJECTS_DATA.push(newProj);
    closeCreateModal();
    renderProjectList();
    renderStats();
    showToast('✅ Project created successfully!');
    createForm.reset();
  });
}

// ── Navigation panel switching ────────────────────────────────
function switchPanel(id) {
  document.querySelectorAll('.dash-panel-section').forEach(sec => {
    sec.style.display = 'none';
  });
  const target = document.getElementById('panel-' + id);
  if (target) target.style.display = 'block';
  setActiveNav(id);
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const user = authGuard('admin');
  if (!user) return;
  fillSidebarUser();
  initSidebar();
  renderStats();
  renderProjectList();

  // Topbar date
  const dateEl = document.getElementById('topbar-date');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-IN', { weekday:'short', year:'numeric', month:'short', day:'numeric' });

  // Main ring
  const mainRing = document.getElementById('main-ring');
  const avgProg  = Math.round(PROJECTS_DATA.reduce((s,p) => s+p.progress, 0) / PROJECTS_DATA.length);
  renderRing(mainRing, avgProg);
  const mainPctEl = document.getElementById('main-ring-pct');
  if (mainPctEl) mainPctEl.textContent = avgProg + '%';

  // Default panel
  switchPanel('overview');
});

window.openProjectDetail  = openProjectDetail;
window.closeProjectModal   = closeProjectModal;
window.openCreateModal     = openCreateModal;
window.closeCreateModal    = closeCreateModal;
window.switchPanel         = switchPanel;
window.renderRing          = renderRing;
