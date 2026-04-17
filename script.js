/* =============================================
   SHADOWMEAL :: script.js
   All interactivity, data, animations
   ============================================= */

'use strict';

// =============================================
// DATA
// =============================================

const FOOD_DATA = [
  { id: 'F001', name: '50x Synth Burgers', source: 'MegaCorp Cafeteria, Sector-B', qty: 50, unit: 'portions', color: 'green',  timer: 4200, risk: 'LOW',   tag: 'HOT-SURPLUS' },
  { id: 'F002', name: '120kg Rice Bricks',  source: 'Underground Silo, Sector-D', qty: 120, unit: 'kg',      color: 'purple', timer: 7800, risk: 'LOW',   tag: 'BULK' },
  { id: 'F003', name: '30x Protein Packs',  source: 'BioLab Kitchen, Sector-A',  qty: 30,  unit: 'packs',   color: 'orange', timer: 900,  risk: 'HIGH',  tag: '⚠ EXPIRING' },
  { id: 'F004', name: '80L Hydra-Soup',     source: 'Street Kitchen, Sector-F',  qty: 80,  unit: 'liters',  color: 'cyan',   timer: 2100, risk: 'MED',   tag: 'LIQUID' },
  { id: 'F005', name: '200x Nutri-Wafers',  source: 'FEMA Cache, Sector-C',      qty: 200, unit: 'packs',   color: 'green',  timer: 18000, risk: 'LOW',  tag: 'STABLE' },
  { id: 'F006', name: '45 Bread Loaves',    source: 'Bakery Node-7, Sector-E',   qty: 45,  unit: 'loaves',  color: 'purple', timer: 1200, risk: 'HIGH',  tag: '⚠ EXPIRING' },
  { id: 'F007', name: '60kg Veggie Mix',    source: 'Rooftop Farm, Sector-G',    qty: 60,  unit: 'kg',      color: 'orange', timer: 3600, risk: 'MED',   tag: 'FRESH' },
  { id: 'F008', name: '100 Meal-Kits',      source: 'NGO Warehouse, Sector-B',   qty: 100, unit: 'kits',    color: 'cyan',   timer: 9000, risk: 'LOW',   tag: 'PRIORITY' },
];

const DRONE_DATA = [
  { id: 'DRN-01', name: 'Shadow Hawk',   battery: 87, cargo: '12/20kg', status: 'active',  route: 'HZ-01 → DEPOT-A' },
  { id: 'DRN-02', name: 'Night Carrier', battery: 42, cargo: '8/15kg',  status: 'active',  route: 'HUB-B → HZ-03' },
  { id: 'DRN-03', name: 'Ghost Wing',    battery: 15, cargo: '0/25kg',  status: 'damaged', route: 'GROUNDED' },
  { id: 'DRN-04', name: 'Iron Moth',     battery: 100,cargo: '0/20kg',  status: 'idle',    route: 'STANDBY' },
  { id: 'DRN-05', name: 'Void Runner',   battery: 63, cargo: '18/20kg', status: 'active',  route: 'HZ-02 → HZ-04' },
  { id: 'DRN-06', name: 'Echo Glider',   battery: 28, cargo: '5/15kg',  status: 'idle',    route: 'DEPOT-C → HZ-05' },
];

const VOLUNTEER_DATA = [
  { id: 'V01', name: 'Marco Z.',     role: 'Route Runner', missions: 47, zone: 'Sector-B', status: 'active' },
  { id: 'V02', name: 'Lyra Chen',   role: 'Loader',        missions: 31, zone: 'Sector-D', status: 'active' },
  { id: 'V03', name: 'Ajax K.',     role: 'Interceptor',   missions: 22, zone: 'Sector-A', status: 'standby' },
  { id: 'V04', name: 'Nora V.',     role: 'Scout',         missions: 58, zone: 'Sector-F', status: 'active' },
  { id: 'V05', name: 'Blaze T.',    role: 'Courier',       missions: 14, zone: 'Sector-G', status: 'standby' },
  { id: 'V06', name: 'Cipher Sol',  role: 'Tech Ops',      missions: 89, zone: 'Sector-C', status: 'active' },
  { id: 'V07', name: 'Remi Sato',   role: 'Driver',        missions: 33, zone: 'Sector-E', status: 'standby' },
  { id: 'V08', name: 'Zyla Park',   role: 'Coordinator',   missions: 102,zone: 'Sector-B', status: 'active' },
];

const DISTRICTS = [
  { name: 'Sector-A', pct: 78,  color: '#39ff14', meals: 312 },
  { name: 'Sector-B', pct: 92,  color: '#bf00ff', meals: 478 },
  { name: 'Sector-C', pct: 55,  color: '#ff6600', meals: 220 },
  { name: 'Sector-D', pct: 68,  color: '#00e5ff', meals: 285 },
  { name: 'Sector-E', pct: 40,  color: '#39ff14', meals: 164 },
  { name: 'Sector-F', pct: 83,  color: '#bf00ff', meals: 341 },
  { name: 'Sector-G', pct: 30,  color: '#ff6600', meals: 120 },
];

const FEED_TEMPLATES = [
  ['green',  'INTERCEPT', 'Cargo secured — 50x Synth Burgers en route to HZ-02'],
  ['purple', 'DRONE-05',  'Delivering 18kg payload. ETA: 4 min. Route OMEGA-3.'],
  ['orange', 'ALERT',     'Hunger spike detected — Sector-F population density +22%'],
  ['cyan',   'VOLUNTEER', 'Marco Z. confirmed pickup at MegaCorp Cafeteria'],
  ['green',  'ROUTE',     'New path established: DEPOT-A → HZ-01 (6.2km)'],
  ['purple', 'SYSTEM',    'Encryption refreshed. All comms scrambled. Stay dark.'],
  ['orange', 'WARNING',   '30x Protein Packs expiring in 15 min — intercept needed!'],
  ['cyan',   'DISPATCH',  'DRN-02 assigned to Night Kitchen, Sector-D'],
  ['green',  'DELIVERY',  '120 meals distributed. +120 people fed in Sector-B'],
  ['purple', 'OVERRIDE',  'Admin cleared route — Sector-G now operational'],
  ['orange', 'BREACH',    'Checkpoint 7 scan active — rerouting via alley grid'],
  ['cyan',   'COMMS',     'Lyra Chen checking in — cargo loaded and secured'],
];

// =============================================
// STATE
// =============================================
const state = {
  foodTimers: {},
  foodStatus: {},   // 'available' | 'assigned' | 'claimed'
  volAssigned: {},
  stats: { meals: 0, people: 0, food: 0, routes: 0 },
  statsTarget: { meals: 1847, people: 923, food: 742, routes: 12 },
  feedMessages: [],
  panicMode: false,
  dronePathProgress: 0,
};

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  buildFoodCards();
  buildDroneCards();
  buildVolunteerList();
  buildDistrictBars();
  initFoodTimers();
  initStatCounters();
  initLiveFeed();
  initDroneAnimation();
  initPanicButton();
  initScanLine();
  initNavLinks();
  initSectionObserver();
  initFooterClock();
  initAutoMealTicker();
});

// =============================================
// FOOD CARDS
// =============================================
function buildFoodCards() {
  const grid = document.getElementById('foodGrid');
  grid.innerHTML = '';

  FOOD_DATA.forEach(item => {
    state.foodStatus[item.id] = 'available';

    const card = document.createElement('div');
    card.className = `food-card ${item.color}`;
    card.id = `card-${item.id}`;

    card.innerHTML = `
      <div class="food-status-badge status-available" id="badge-${item.id}">AVAILABLE</div>
      <div class="food-card-tag">
        <span>${item.id}</span>
        <span>${item.tag}</span>
      </div>
      <div class="food-name">${item.name}</div>
      <div class="food-source">${item.source}</div>
      <div class="food-timer ok" id="timer-${item.id}">${formatTime(item.timer)}</div>
      <div class="food-meta">
        <span>QTY: ${item.qty} ${item.unit}</span>
        <span>RISK: ${item.risk}</span>
      </div>
      <button class="intercept-btn ready" id="btn-${item.id}" onclick="interceptFood('${item.id}')">
        ▶ INTERCEPT
      </button>
    `;
    grid.appendChild(card);

    // Store remaining seconds
    state.foodTimers[item.id] = item.timer;
  });
}

function interceptFood(id) {
  if (state.foodStatus[id] !== 'available') return;
  state.foodStatus[id] = 'assigned';

  const btn = document.getElementById(`btn-${id}`);
  const badge = document.getElementById(`badge-${id}`);

  btn.textContent = '✔ ASSIGNED';
  btn.className = 'intercept-btn assigned';
  badge.textContent = 'ASSIGNED';
  badge.className = 'food-status-badge status-assigned';

  const item = FOOD_DATA.find(f => f.id === id);
  addFeedItem('green', 'INTERCEPT', `${item.name} intercepted — en route to hunger zone`);

  state.stats.meals += Math.floor(item.qty * 1.2);
  state.stats.people += Math.floor(item.qty * 0.6);
  state.stats.food += Math.floor(item.qty * 0.8);
  updateStatDisplay();
}

// =============================================
// FOOD TIMERS
// =============================================
function initFoodTimers() {
  setInterval(() => {
    FOOD_DATA.forEach(item => {
      if (state.foodTimers[item.id] <= 0) return;
      state.foodTimers[item.id]--;

      const t = state.foodTimers[item.id];
      const el = document.getElementById(`timer-${item.id}`);
      if (!el) return;

      el.textContent = formatTime(t);
      el.className = 'food-timer';

      if (t < 600) {
        el.classList.add('urgent');
        if (state.foodStatus[item.id] === 'available') {
          addFeedItem('orange', 'EXPIRE', `${item.id} critical — ${formatTime(t)} remaining!`);
        }
      } else if (t < 1800) {
        el.classList.add('warn');
      } else {
        el.classList.add('ok');
      }

      // Expire
      if (t <= 0 && state.foodStatus[item.id] === 'available') {
        state.foodStatus[item.id] = 'claimed';
        const btn = document.getElementById(`btn-${item.id}`);
        const badge = document.getElementById(`badge-${item.id}`);
        if (btn) { btn.textContent = '✖ EXPIRED'; btn.className = 'intercept-btn claimed'; }
        if (badge) { badge.textContent = 'EXPIRED'; badge.className = 'food-status-badge status-claimed'; }
        addFeedItem('orange', 'LOSS', `${item.id} expired — food lost`);
      }
    });
  }, 1000);
}

function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

// =============================================
// DRONE CARDS
// =============================================
function buildDroneCards() {
  const container = document.getElementById('droneCards');
  container.innerHTML = '';

  DRONE_DATA.forEach(drone => {
    const pct = drone.battery;
    const lvl = pct > 50 ? 'high' : pct > 20 ? 'medium' : 'low';
    const statusClass = `status-${drone.status}`;
    const statusLabel = drone.status.toUpperCase();

    const card = document.createElement('div');
    card.className = 'drone-card';
    card.innerHTML = `
      <div class="drone-id">${drone.id}</div>
      <div class="drone-info">
        <div class="drone-name">${drone.name}</div>
        <div class="drone-stats">
          <span class="drone-stat">📦 ${drone.cargo}</span>
          <span class="drone-stat">🛣 ${drone.route}</span>
        </div>
      </div>
      <div class="drone-battery">
        <div class="battery-bar">
          <div class="battery-fill ${lvl}" style="width:${pct}%"></div>
        </div>
        <div class="battery-pct ${lvl}">${pct}%</div>
        <span class="drone-status-badge ${statusClass}">${statusLabel}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

// =============================================
// VOLUNTEER LIST
// =============================================
function buildVolunteerList() {
  const container = document.getElementById('volunteerList');
  container.innerHTML = '';

  VOLUNTEER_DATA.forEach(vol => {
    const initials = vol.name.split(' ').map(w => w[0]).join('').slice(0, 2);
    const row = document.createElement('div');
    row.className = 'volunteer-row';
    row.id = `vol-${vol.id}`;

    row.innerHTML = `
      <div class="vol-avatar">${initials}</div>
      <div class="vol-info">
        <div class="vol-name">${vol.name}</div>
        <div class="vol-meta">
          <span>${vol.role}</span>
          <span>·</span>
          <span>${vol.zone}</span>
          <span>·</span>
          <span>${vol.missions} ops</span>
        </div>
      </div>
      <button class="assign-btn ready" id="vbtn-${vol.id}" onclick="assignVolunteer('${vol.id}')">
        ASSIGN
      </button>
    `;
    container.appendChild(row);
  });
}

function assignVolunteer(id) {
  if (state.volAssigned[id]) return;
  state.volAssigned[id] = true;

  const btn = document.getElementById(`vbtn-${id}`);
  if (btn) { btn.textContent = 'ON MISSION'; btn.className = 'assign-btn done'; }

  const vol = VOLUNTEER_DATA.find(v => v.id === id);
  addFeedItem('cyan', 'VOLUNTEER', `${vol.name} assigned — heading to ${vol.zone}`);
}

// =============================================
// IMPACT STATS COUNTERS
// =============================================
function initStatCounters() {
  const duration = 2500;
  const start = performance.now();

  const targets = state.statsTarget;

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    state.stats.meals  = Math.floor(targets.meals  * ease);
    state.stats.people = Math.floor(targets.people * ease);
    state.stats.food   = Math.floor(targets.food   * ease);
    state.stats.routes = Math.floor(targets.routes * ease);

    updateStatDisplay();

    if (progress < 1) requestAnimationFrame(animate);
  }

  // Delay so section is visible
  setTimeout(() => requestAnimationFrame(animate), 600);
}

function updateStatDisplay() {
  const els = {
    meals:  document.getElementById('statMeals'),
    people: document.getElementById('statPeople'),
    food:   document.getElementById('statFood'),
    routes: document.getElementById('statRoutes'),
  };
  const bars = {
    meals:  document.getElementById('barMeals'),
    people: document.getElementById('barPeople'),
    food:   document.getElementById('barFood'),
    routes: document.getElementById('barRoutes'),
  };

  if (els.meals)  els.meals.textContent  = state.stats.meals.toLocaleString();
  if (els.people) els.people.textContent = state.stats.people.toLocaleString();
  if (els.food)   els.food.textContent   = state.stats.food.toLocaleString();
  if (els.routes) els.routes.textContent = state.stats.routes;

  const maxM = state.statsTarget.meals;
  const maxP = state.statsTarget.people;
  const maxF = state.statsTarget.food;

  if (bars.meals)  bars.meals.style.width  = `${Math.min(state.stats.meals  / maxM * 100, 100)}%`;
  if (bars.people) bars.people.style.width = `${Math.min(state.stats.people / maxP * 100, 100)}%`;
  if (bars.food)   bars.food.style.width   = `${Math.min(state.stats.food   / maxF * 100, 100)}%`;
  if (bars.routes) bars.routes.style.width = `${Math.min(state.stats.routes / 20  * 100, 100)}%`;
}

// =============================================
// AUTO MEAL TICKER
// =============================================
function initAutoMealTicker() {
  setInterval(() => {
    state.statsTarget.meals  += Math.floor(Math.random() * 3) + 1;
    state.statsTarget.people += Math.floor(Math.random() * 2) + 1;
    state.statsTarget.food   += Math.floor(Math.random() * 2);

    state.stats.meals  = state.statsTarget.meals;
    state.stats.people = state.statsTarget.people;
    state.stats.food   = state.statsTarget.food;

    updateStatDisplay();
  }, 4000);
}

// =============================================
// DISTRICT BARS
// =============================================
function buildDistrictBars() {
  const container = document.getElementById('districtBars');
  container.innerHTML = '';

  DISTRICTS.forEach(d => {
    const row = document.createElement('div');
    row.className = 'district-row';
    row.innerHTML = `
      <div class="district-name">${d.name}</div>
      <div class="district-bar-bg">
        <div class="district-bar-fill" id="dbar-${d.name}" 
             style="width:0%; background:${d.color}; box-shadow: 0 0 8px ${d.color}66">
          ${d.meals} meals
        </div>
      </div>
      <div class="district-pct" style="color:${d.color}">${d.pct}%</div>
    `;
    container.appendChild(row);
  });

  // Animate bars after short delay
  setTimeout(() => {
    DISTRICTS.forEach(d => {
      const bar = document.getElementById(`dbar-${d.name}`);
      if (bar) bar.style.width = `${d.pct}%`;
    });
  }, 800);
}

// =============================================
// LIVE FEED
// =============================================
function initLiveFeed() {
  // Seed initial messages
  const seeds = [
    ['green',  'SYSTEM',    'ShadowMeal URN v2.7.1 initialized — all systems LIVE'],
    ['purple', 'ENCRYPT',   'AES-512 encryption engaged. Communications scrambled.'],
    ['cyan',   'MAP',       'Smuggler\'s map loaded — 12 active routes detected'],
    ['orange', 'ALERT',     '5 hunger zones identified — operations commencing'],
  ];
  seeds.forEach(([color, tag, msg]) => addFeedItem(color, tag, msg));

  // Auto generate messages
  setInterval(() => {
    const tpl = FEED_TEMPLATES[Math.floor(Math.random() * FEED_TEMPLATES.length)];
    addFeedItem(tpl[0], tpl[1], tpl[2]);
  }, 5000);
}

function addFeedItem(color, tag, msg) {
  const feed = document.getElementById('liveFeed');
  if (!feed) return;

  const now = new Date();
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

  const item = document.createElement('div');
  item.className = `feed-item ${color}`;
  item.innerHTML = `
    <span class="feed-time">[${time}]</span>
    <span class="feed-msg"><strong>[${tag}]</strong> ${msg}</span>
  `;

  // Prepend (newest first since column-reverse)
  feed.appendChild(item);

  // Keep only 40 items
  while (feed.children.length > 40) {
    feed.removeChild(feed.firstChild);
  }

  // Scroll to latest
  feed.scrollTop = feed.scrollHeight;
}

// =============================================
// DRONE SVG ANIMATION
// =============================================
function initDroneAnimation() {
  const svg = document.getElementById('cityMap');
  if (!svg) return;

  // Drone A: travels along route 1 (DEPOT-A -> HUB-B)
  const droneA = document.getElementById('droneA');
  const droneB = document.getElementById('droneB');

  // Waypoints for Drone A
  const pathA = [
    { x: 160, y: 58 },
    { x: 220, y: 90 },
    { x: 300, y: 130 },
    { x: 380, y: 183 },
    { x: 450, y: 165 },
    { x: 550, y: 155 },
    { x: 680, y: 183 },
    { x: 680, y: 183 }, // hold
    { x: 550, y: 155 },
    { x: 450, y: 165 },
    { x: 380, y: 183 },
    { x: 300, y: 130 },
    { x: 220, y: 90 },
    { x: 160, y: 58 },
  ];

  // Waypoints for Drone B
  const pathB = [
    { x: 310, y: 140 },
    { x: 340, y: 200 },
    { x: 360, y: 260 },
    { x: 380, y: 325 },
    { x: 430, y: 370 },
    { x: 490, y: 440 },
    { x: 490, y: 440 },
    { x: 430, y: 370 },
    { x: 380, y: 325 },
    { x: 310, y: 250 },
    { x: 310, y: 140 },
  ];

  animateDroneAlongPath(droneA, pathA, 6000);
  setTimeout(() => animateDroneAlongPath(droneB, pathB, 7000), 1500);
}

function animateDroneAlongPath(el, path, loopDuration) {
  if (!el || path.length < 2) return;

  const segDuration = loopDuration / (path.length - 1);
  let segIdx = 0;
  let startTime = null;

  function step(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const t = Math.min(elapsed / segDuration, 1);

    const from = path[segIdx];
    const to   = path[segIdx + 1];

    const x = from.x + (to.x - from.x) * easeInOut(t);
    const y = from.y + (to.y - from.y) * easeInOut(t);

    el.setAttribute('cx', x);
    el.setAttribute('cy', y);

    if (t >= 1) {
      segIdx = (segIdx + 1) % (path.length - 1);
      startTime = ts;
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// =============================================
// SCAN LINE ANIMATION
// =============================================
function initScanLine() {
  const scanLine = document.getElementById('scanLine');
  if (!scanLine) return;

  let y = 0;
  let dir = 1;

  function moveScan() {
    y += dir * 2;
    if (y >= 500) dir = -1;
    if (y <= 0)   dir = 1;
    scanLine.setAttribute('y1', y);
    scanLine.setAttribute('y2', y);
    requestAnimationFrame(moveScan);
  }
  requestAnimationFrame(moveScan);
}

// =============================================
// PANIC BUTTON
// =============================================
function initPanicButton() {
  const panicBtn  = document.getElementById('panicBtn');
  const panicBack = document.getElementById('panicBack');
  const panicScreen = document.getElementById('panicScreen');
  const mainApp     = document.getElementById('mainApp');

  panicBtn.addEventListener('click', () => {
    panicScreen.classList.remove('hidden');
    mainApp.style.display = 'none';
    state.panicMode = true;
  });

  panicBack.addEventListener('click', () => {
    panicScreen.classList.add('hidden');
    mainApp.style.display = '';
    state.panicMode = false;
    addFeedItem('purple', 'SYSTEM', 'Cover screen deactivated — back on the network');
  });

  // Keyboard shortcut: Escape to toggle
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.panicMode) {
      panicBack.click();
    }
    // P = panic
    if (e.key === 'p' && !state.panicMode) {
      panicBtn.click();
    }
  });
}

// =============================================
// NAV LINKS
// =============================================
function initNavLinks() {
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Update active nav on scroll
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top < 200) current = section.id;
    });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.dataset.section === current) l.classList.add('active');
    });
  });
}

// =============================================
// INTERSECTION OBSERVER (section entrance)
// =============================================
function initSectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.section').forEach(s => observer.observe(s));
}

// =============================================
// FOOTER CLOCK
// =============================================
function initFooterClock() {
  const el = document.getElementById('footerTime');
  if (!el) return;
  function update() {
    const now = new Date();
    el.textContent = `TIMESTAMP: ${now.toISOString().replace('T', ' ').slice(0, 19)} UTC`;
  }
  update();
  setInterval(update, 1000);
}
