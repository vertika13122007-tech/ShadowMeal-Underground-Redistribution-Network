/* =============================================
   SHADOWMEAL :: App.jsx  (React version)
   All-in-one component file — paste into your
   React project (Vite/CRA) and add Google Fonts
   + the same styles.css from the HTML version.
   ============================================= */

import { useState, useEffect, useRef, useCallback } from "react";

// =============================================
// CONSTANTS
// =============================================
const FOOD_DATA = [
  { id: "F001", name: "50x Synth Burgers",  source: "MegaCorp Cafeteria, Sector-B", qty: 50,  unit: "portions", color: "green",  timer: 4200, risk: "LOW",  tag: "HOT-SURPLUS" },
  { id: "F002", name: "120kg Rice Bricks",   source: "Underground Silo, Sector-D",   qty: 120, unit: "kg",       color: "purple", timer: 7800, risk: "LOW",  tag: "BULK" },
  { id: "F003", name: "30x Protein Packs",   source: "BioLab Kitchen, Sector-A",     qty: 30,  unit: "packs",    color: "orange", timer: 900,  risk: "HIGH", tag: "⚠ EXPIRING" },
  { id: "F004", name: "80L Hydra-Soup",      source: "Street Kitchen, Sector-F",     qty: 80,  unit: "liters",   color: "cyan",   timer: 2100, risk: "MED",  tag: "LIQUID" },
  { id: "F005", name: "200x Nutri-Wafers",   source: "FEMA Cache, Sector-C",         qty: 200, unit: "packs",    color: "green",  timer: 18000,risk: "LOW",  tag: "STABLE" },
  { id: "F006", name: "45 Bread Loaves",     source: "Bakery Node-7, Sector-E",      qty: 45,  unit: "loaves",   color: "purple", timer: 1200, risk: "HIGH", tag: "⚠ EXPIRING" },
  { id: "F007", name: "60kg Veggie Mix",     source: "Rooftop Farm, Sector-G",       qty: 60,  unit: "kg",       color: "orange", timer: 3600, risk: "MED",  tag: "FRESH" },
  { id: "F008", name: "100 Meal-Kits",       source: "NGO Warehouse, Sector-B",      qty: 100, unit: "kits",     color: "cyan",   timer: 9000, risk: "LOW",  tag: "PRIORITY" },
];

const DRONE_DATA = [
  { id: "DRN-01", name: "Shadow Hawk",   battery: 87, cargo: "12/20kg",  status: "active",  route: "HZ-01 → DEPOT-A" },
  { id: "DRN-02", name: "Night Carrier", battery: 42, cargo: "8/15kg",   status: "active",  route: "HUB-B → HZ-03" },
  { id: "DRN-03", name: "Ghost Wing",    battery: 15, cargo: "0/25kg",   status: "damaged", route: "GROUNDED" },
  { id: "DRN-04", name: "Iron Moth",     battery: 100,cargo: "0/20kg",   status: "idle",    route: "STANDBY" },
  { id: "DRN-05", name: "Void Runner",   battery: 63, cargo: "18/20kg",  status: "active",  route: "HZ-02 → HZ-04" },
  { id: "DRN-06", name: "Echo Glider",   battery: 28, cargo: "5/15kg",   status: "idle",    route: "DEPOT-C → HZ-05" },
];

const VOLUNTEER_DATA = [
  { id: "V01", name: "Marco Z.",    role: "Route Runner", missions: 47,  zone: "Sector-B" },
  { id: "V02", name: "Lyra Chen",  role: "Loader",        missions: 31,  zone: "Sector-D" },
  { id: "V03", name: "Ajax K.",    role: "Interceptor",   missions: 22,  zone: "Sector-A" },
  { id: "V04", name: "Nora V.",    role: "Scout",         missions: 58,  zone: "Sector-F" },
  { id: "V05", name: "Blaze T.",   role: "Courier",       missions: 14,  zone: "Sector-G" },
  { id: "V06", name: "Cipher Sol", role: "Tech Ops",      missions: 89,  zone: "Sector-C" },
  { id: "V07", name: "Remi Sato",  role: "Driver",        missions: 33,  zone: "Sector-E" },
  { id: "V08", name: "Zyla Park",  role: "Coordinator",   missions: 102, zone: "Sector-B" },
];

const DISTRICTS = [
  { name: "Sector-A", pct: 78, color: "#39ff14", meals: 312 },
  { name: "Sector-B", pct: 92, color: "#bf00ff", meals: 478 },
  { name: "Sector-C", pct: 55, color: "#ff6600", meals: 220 },
  { name: "Sector-D", pct: 68, color: "#00e5ff", meals: 285 },
  { name: "Sector-E", pct: 40, color: "#39ff14", meals: 164 },
  { name: "Sector-F", pct: 83, color: "#bf00ff", meals: 341 },
  { name: "Sector-G", pct: 30, color: "#ff6600", meals: 120 },
];

const FEED_TEMPLATES = [
  ["green",  "INTERCEPT", "Cargo secured — surplus en route to hunger zone"],
  ["purple", "DRONE-05",  "Delivering 18kg payload. ETA: 4 min. Route OMEGA-3."],
  ["orange", "ALERT",     "Hunger spike detected — Sector-F population +22%"],
  ["cyan",   "VOLUNTEER", "Marco Z. confirmed pickup at MegaCorp Cafeteria"],
  ["green",  "ROUTE",     "New path established: DEPOT-A → HZ-01 (6.2km)"],
  ["purple", "SYSTEM",    "Encryption refreshed. All comms scrambled."],
  ["orange", "WARNING",   "Protein Packs expiring — intercept needed!"],
  ["cyan",   "DISPATCH",  "DRN-02 assigned to Night Kitchen, Sector-D"],
  ["green",  "DELIVERY",  "120 meals distributed — Sector-B +120 fed"],
];

function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = n => String(n).padStart(2, "0");
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(sec)}`;
  return `${pad(m)}:${pad(sec)}`;
}

function getTimerClass(t) {
  if (t < 600)  return "food-timer urgent";
  if (t < 1800) return "food-timer warn";
  return "food-timer ok";
}

// =============================================
// PANIC SCREEN
// =============================================
function PanicScreen({ onBack }) {
  const rows = [
    ["001","Office Supplies","Admin","24","$12.50","$300.00","Approved"],
    ["002","Printer Cartridges","Admin","6","$45.00","$270.00","Pending"],
    ["003","Catering - Q3","Operations","1","$1200.00","$1200.00","Approved"],
    ["004","Laptop Repairs","IT","3","$250.00","$750.00","Review"],
    ["005","Desk Chairs","Facilities","10","$320.00","$3200.00","Approved"],
    ["006","Software Licenses","IT","15","$99.00","$1485.00","Pending"],
    ["007","Cleaning Supplies","Facilities","50","$8.75","$437.50","Approved"],
    ["008","Training Materials","HR","20","$35.00","$700.00","Approved"],
  ];

  return (
    <div className="panic-screen">
      <div className="panic-header">
        <span>📊 Q3 Budget Tracker - Municipal Food Services Division</span>
        <button className="panic-back-btn" onClick={onBack}>← Back to Work</button>
      </div>
      <div className="panic-table-wrap">
        <table className="panic-table">
          <thead>
            <tr><th>ID</th><th>Item</th><th>Category</th><th>Qty</th><th>Unit Cost</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r[0]}>
                {r.map((cell, i) => <td key={i}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="panic-footer">
        <span>Sheet 1 of 3 &nbsp;|&nbsp; Last saved: today &nbsp;|&nbsp; Autosave ON</span>
      </div>
    </div>
  );
}

// =============================================
// HEADER
// =============================================
function Header({ onPanic, activeSection, onNavClick }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-wrap">
          <span className="logo-icon">◈</span>
          <div>
            <h1 className="logo-title">SHADOW<span className="accent-green">MEAL</span></h1>
            <p className="logo-sub">Underground Redistribution Network v2.7.1</p>
          </div>
        </div>
      </div>
      <nav className="nav">
        {["map","stash","drones","impact"].map(s => (
          <a key={s} href={`#${s}`}
             className={`nav-link${activeSection === s ? " active" : ""}`}
             data-section={s}
             onClick={() => onNavClick(s)}>
            {s.toUpperCase()}
          </a>
        ))}
      </nav>
      <div className="header-right">
        <div className="status-dot" />
        <span className="status-text">LIVE</span>
        <button className="panic-btn" onClick={onPanic}>⚠ PANIC</button>
      </div>
    </header>
  );
}

// =============================================
// TICKER
// =============================================
function Ticker() {
  const items = [
    "▶ NETWORK ACTIVE","▶ 12 ROUTES OPERATIONAL","▶ SECTOR 7 HUNGER ALERT",
    "▶ DRONE-04 CARGO DELIVERED","▶ 847 MEALS IN TRANSIT","▶ SURPLUS: EASTSIDE DISTRICT",
    "▶ VOLUNTEER MARCO ACTIVE","▶ ENCRYPTION: AES-512 ENGAGED",
    "▶ INTERCEPT OPERATION: OMEGA-3 LIVE",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="ticker-bar">
      <div className="ticker-inner">
        {doubled.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

// =============================================
// MAP SECTION
// =============================================
function SmugglersMap() {
  const droneARef = useRef(null);
  const droneBRef = useRef(null);
  const scanRef   = useRef(null);

  const pathA = [
    {x:160,y:58},{x:220,y:90},{x:300,y:130},{x:380,y:183},
    {x:450,y:165},{x:550,y:155},{x:680,y:183},{x:680,y:183},
    {x:550,y:155},{x:450,y:165},{x:380,y:183},{x:300,y:130},{x:220,y:90},{x:160,y:58},
  ];
  const pathB = [
    {x:310,y:140},{x:340,y:200},{x:360,y:260},{x:380,y:325},
    {x:430,y:370},{x:490,y:440},{x:490,y:440},
    {x:430,y:370},{x:380,y:325},{x:310,y:250},{x:310,y:140},
  ];

  function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

  function animPath(el, path, dur) {
    let seg = 0, start = null;
    const segDur = dur / (path.length - 1);
    function step(ts) {
      if (!start) start = ts;
      const t = Math.min((ts - start) / segDur, 1);
      const from = path[seg], to = path[seg+1];
      el.setAttribute("cx", from.x + (to.x - from.x) * ease(t));
      el.setAttribute("cy", from.y + (to.y - from.y) * ease(t));
      if (t >= 1) { seg = (seg+1) % (path.length-1); start = ts; }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  useEffect(() => {
    if (droneARef.current) animPath(droneARef.current, pathA, 6000);
    setTimeout(() => { if (droneBRef.current) animPath(droneBRef.current, pathB, 7000); }, 1500);

    let y = 0, dir = 1;
    function moveScan() {
      y += dir * 2; if (y >= 500) dir = -1; if (y <= 0) dir = 1;
      if (scanRef.current) {
        scanRef.current.setAttribute("y1", y);
        scanRef.current.setAttribute("y2", y);
      }
      requestAnimationFrame(moveScan);
    }
    requestAnimationFrame(moveScan);
  }, []);

  const blocks = [
    [20,20,120,80],[160,20,80,60],[260,20,140,100],[420,20,100,70],[540,20,160,90],[720,20,160,70],
    [20,140,80,100],[120,130,120,120],[260,140,100,80],[380,130,120,110],[520,140,140,90],[680,130,200,110],
    [20,280,140,90],[180,270,100,110],[300,280,160,80],[480,270,120,100],[620,280,260,90],
    [20,400,200,80],[240,400,140,80],[400,410,180,70],[600,400,280,80],
  ];

  const hungerZones = [
    {cx:80,cy:180,r:35,label:"HZ-01"},{cx:380,cy:325,r:40,label:"HZ-02"},
    {cx:750,cy:325,r:35,label:"HZ-03"},{cx:490,cy:445,r:30,label:"HZ-04"},
    {cx:780,cy:60,r:30,label:"HZ-05"},
  ];

  return (
    <section id="map" className="section visible">
      <div className="section-header">
        <h2 className="section-title"><span className="title-bracket">[</span> SMUGGLER'S MAP <span className="title-bracket">]</span></h2>
        <span className="section-tag">ACTIVE ROUTES: 12 | HUNGER ZONES: 5</span>
      </div>
      <div className="map-container">
        <svg viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg" className="city-map">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a1a2e" strokeWidth="0.5"/>
            </pattern>
            <filter id="glow-green"><feGaussianBlur stdDeviation="3" result="cb"/><feMerge><feMergeNode in="cb"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="glow-purple"><feGaussianBlur stdDeviation="4" result="cb"/><feMerge><feMergeNode in="cb"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="glow-orange"><feGaussianBlur stdDeviation="5" result="cb"/><feMerge><feMergeNode in="cb"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <marker id="arrowG" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#39ff14"/></marker>
            <marker id="arrowP" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#bf00ff"/></marker>
          </defs>

          <rect width="900" height="500" fill="#050510"/>
          <rect width="900" height="500" fill="url(#grid)"/>

          {blocks.map(([x,y,w,h],i) => (
            <rect key={i} x={x} y={y} width={w} height={h} fill="#0d0d1a" stroke="#1a1a3a" strokeWidth="1"/>
          ))}

          {/* Routes */}
          <path d="M 160 60 Q 260 100 380 185" fill="none" stroke="#39ff14" strokeWidth="2" strokeDasharray="8 4" filter="url(#glow-green)" opacity="0.8" markerEnd="url(#arrowG)"/>
          <path d="M 380 185 Q 520 150 680 185" fill="none" stroke="#39ff14" strokeWidth="2" strokeDasharray="8 4" filter="url(#glow-green)" opacity="0.8" markerEnd="url(#arrowG)"/>
          <path d="M 310 140 Q 310 240 380 325" fill="none" stroke="#bf00ff" strokeWidth="2" strokeDasharray="6 3" filter="url(#glow-purple)" opacity="0.8" markerEnd="url(#arrowP)"/>
          <path d="M 680 185 Q 750 350 750 440" fill="none" stroke="#ff6600" strokeWidth="2" strokeDasharray="8 4" filter="url(#glow-orange)" opacity="0.7"/>
          <path d="M 90 270 Q 200 300 300 325" fill="none" stroke="#39ff14" strokeWidth="1.5" strokeDasharray="5 5" filter="url(#glow-green)" opacity="0.6"/>

          {/* Hunger Zones */}
          {hungerZones.map(({cx,cy,r,label}) => (
            <g key={label}>
              <circle className="hunger-zone" cx={cx} cy={cy} r={r} fill="none" stroke="#ff6600" strokeWidth="2" filter="url(#glow-orange)"/>
              <circle cx={cx} cy={cy} r={r*0.22} fill="#ff6600" opacity="0.6"/>
              <text x={cx} y={cy+r+13} textAnchor="middle" fill="#ff6600" fontFamily="Share Tech Mono" fontSize="9" filter="url(#glow-orange)">{label}</text>
            </g>
          ))}

          {/* Depot squares */}
          <rect x="150" y="48" width="20" height="20" fill="#39ff14" opacity="0.8" filter="url(#glow-green)"/>
          <text x="160" y="83" textAnchor="middle" fill="#39ff14" fontFamily="Share Tech Mono" fontSize="8">DEPOT-A</text>
          <rect x="370" y="173" width="20" height="20" fill="#bf00ff" opacity="0.8" filter="url(#glow-purple)"/>
          <text x="380" y="210" textAnchor="middle" fill="#bf00ff" fontFamily="Share Tech Mono" fontSize="8">HUB-B</text>
          <rect x="670" y="173" width="20" height="20" fill="#39ff14" opacity="0.8" filter="url(#glow-green)"/>
          <text x="680" y="210" textAnchor="middle" fill="#39ff14" fontFamily="Share Tech Mono" fontSize="8">DEPOT-C</text>

          {/* Drones */}
          <circle ref={droneARef} cx="160" cy="58" r="6" fill="#00ffff" filter="url(#glow-green)">
            <animate attributeName="r" values="5;8;5" dur="1s" repeatCount="indefinite"/>
          </circle>
          <circle ref={droneBRef} cx="310" cy="140" r="5" fill="#ff00ff" filter="url(#glow-purple)">
            <animate attributeName="r" values="4;7;4" dur="1.2s" repeatCount="indefinite"/>
          </circle>

          <line ref={scanRef} x1="0" y1="0" x2="900" y2="0" stroke="#00ffff" strokeWidth="1" opacity="0.15"/>
        </svg>

        <div className="map-legend">
          <div className="legend-item"><span className="legend-dot orange"/> Hunger Zone</div>
          <div className="legend-item"><span className="legend-line green"/> Active Route</div>
          <div className="legend-item"><span className="legend-line purple"/> Covert Route</div>
          <div className="legend-item"><span className="legend-dot cyan"/> Drone</div>
        </div>
      </div>
    </section>
  );
}

// =============================================
// FOOD CARD
// =============================================
function FoodCard({ item, onIntercept }) {
  const [seconds, setSeconds] = useState(item.timer);
  const [status, setStatus] = useState("available");

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 0) { clearInterval(t); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (seconds <= 0 && status === "available") setStatus("expired");
  }, [seconds, status]);

  const handleIntercept = () => {
    if (status !== "available") return;
    setStatus("assigned");
    onIntercept(item);
  };

  const timerCls = seconds < 600 ? "food-timer urgent" : seconds < 1800 ? "food-timer warn" : "food-timer ok";
  const btnLabel = status === "available" ? "▶ INTERCEPT" : status === "assigned" ? "✔ ASSIGNED" : "✖ EXPIRED";
  const btnCls   = `intercept-btn ${status === "available" ? "ready" : status === "assigned" ? "assigned" : "claimed"}`;
  const badgeLabel = status === "available" ? "AVAILABLE" : status === "assigned" ? "ASSIGNED" : "EXPIRED";
  const badgeCls   = `food-status-badge status-${status === "expired" ? "claimed" : status}`;

  return (
    <div className={`food-card ${item.color}`}>
      <div className={badgeCls}>{badgeLabel}</div>
      <div className="food-card-tag"><span>{item.id}</span><span>{item.tag}</span></div>
      <div className="food-name">{item.name}</div>
      <div className="food-source">{item.source}</div>
      <div className={timerCls}>{formatTime(seconds)}</div>
      <div className="food-meta"><span>QTY: {item.qty} {item.unit}</span><span>RISK: {item.risk}</span></div>
      <button className={btnCls} onClick={handleIntercept}>{btnLabel}</button>
    </div>
  );
}

// =============================================
// SURPLUS STASH
// =============================================
function SurplusStash({ onIntercept }) {
  return (
    <section id="stash" className="section visible">
      <div className="section-header">
        <h2 className="section-title"><span className="title-bracket">[</span> SURPLUS STASH <span className="title-bracket">]</span></h2>
        <span className="section-tag">ITEMS: {FOOD_DATA.length} | EXPIRING SOON: 3</span>
      </div>
      <div className="food-grid">
        {FOOD_DATA.map(item => <FoodCard key={item.id} item={item} onIntercept={onIntercept}/>)}
      </div>
    </section>
  );
}

// =============================================
// DRONE CARD
// =============================================
function DroneCard({ drone }) {
  const pct = drone.battery;
  const lvl = pct > 50 ? "high" : pct > 20 ? "medium" : "low";
  const statusClass = `status-${drone.status}`;
  return (
    <div className="drone-card">
      <div className="drone-id">{drone.id}</div>
      <div className="drone-info">
        <div className="drone-name">{drone.name}</div>
        <div className="drone-stats">
          <span className="drone-stat">📦 {drone.cargo}</span>
          <span className="drone-stat">🛣 {drone.route}</span>
        </div>
      </div>
      <div className="drone-battery">
        <div className="battery-bar">
          <div className={`battery-fill ${lvl}`} style={{width:`${pct}%`}}/>
        </div>
        <div className={`battery-pct ${lvl}`}>{pct}%</div>
        <span className={`drone-status-badge ${statusClass}`}>{drone.status.toUpperCase()}</span>
      </div>
    </div>
  );
}

// =============================================
// VOLUNTEER ROW
// =============================================
function VolunteerRow({ vol, onAssign }) {
  const [assigned, setAssigned] = useState(false);
  const initials = vol.name.split(" ").map(w => w[0]).join("").slice(0,2);

  const handle = () => {
    if (assigned) return;
    setAssigned(true);
    onAssign(vol);
  };

  return (
    <div className="volunteer-row">
      <div className="vol-avatar">{initials}</div>
      <div className="vol-info">
        <div className="vol-name">{vol.name}</div>
        <div className="vol-meta">
          <span>{vol.role}</span><span>·</span>
          <span>{vol.zone}</span><span>·</span>
          <span>{vol.missions} ops</span>
        </div>
      </div>
      <button className={`assign-btn ${assigned ? "done" : "ready"}`} onClick={handle}>
        {assigned ? "ON MISSION" : "ASSIGN"}
      </button>
    </div>
  );
}

// =============================================
// DRONE & VOLUNTEER HUB
// =============================================
function DroneHub({ onAssign }) {
  return (
    <section id="drones" className="section visible">
      <div className="section-header">
        <h2 className="section-title"><span className="title-bracket">[</span> DRONE & VOLUNTEER HUB <span className="title-bracket">]</span></h2>
        <span className="section-tag">DRONES: {DRONE_DATA.length} | VOLUNTEERS: {VOLUNTEER_DATA.length}</span>
      </div>
      <div className="drone-vol-grid">
        <div className="sub-panel">
          <h3 className="sub-title">◈ DRONE FLEET</h3>
          <div className="drone-cards">
            {DRONE_DATA.map(d => <DroneCard key={d.id} drone={d}/>)}
          </div>
        </div>
        <div className="sub-panel">
          <h3 className="sub-title">◈ VOLUNTEER NETWORK</h3>
          <div className="volunteer-list">
            {VOLUNTEER_DATA.map(v => <VolunteerRow key={v.id} vol={v} onAssign={onAssign}/>)}
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================
// IMPACT / STATS
// =============================================
function AnimatedCounter({ target, id }) {
  const [val, setVal] = useState(0);
  const [barW, setBarW] = useState(0);
  useEffect(() => {
    const dur = 2500;
    const start = performance.now();
    function anim(now) {
      const p = Math.min((now - start)/dur, 1);
      const e = 1 - Math.pow(1-p, 3);
      setVal(Math.floor(target * e));
      setBarW(Math.round(e * 100));
      if (p < 1) requestAnimationFrame(anim);
    }
    const timer = setTimeout(() => requestAnimationFrame(anim), 400);
    return () => clearTimeout(timer);
  }, [target]);
  return { val, barW };
}

function StatCard({ stat, icon, label, color, target, maxVal }) {
  const [val, setVal] = useState(0);
  const [barW, setBarW] = useState(0);

  useEffect(() => {
    const dur = 2500;
    const start = performance.now();
    function anim(now) {
      const p = Math.min((now-start)/dur, 1);
      const e = 1 - Math.pow(1-p, 3);
      setVal(Math.floor(target * e));
      setBarW(Math.round(Math.min((target/maxVal)*e*100, 100)));
      if (p<1) requestAnimationFrame(anim);
    }
    const t = setTimeout(() => requestAnimationFrame(anim), 400);
    return () => clearTimeout(t);
  }, [target]);

  return (
    <div className="stat-card" data-stat={stat}>
      <span className="stat-icon">{icon}</span>
      <span className="stat-value">{val.toLocaleString()}</span>
      <div className="stat-label">{label}</div>
      <div className="stat-bar"><div className={`stat-bar-fill ${color}`} style={{width:`${barW}%`}}/></div>
    </div>
  );
}

function LiveFeed({ messages }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [messages]);
  return (
    <div className="live-feed" ref={ref}>
      {[...messages].reverse().map((m, i) => (
        <div key={i} className={`feed-item ${m.color}`}>
          <span className="feed-time">[{m.time}]</span>
          <span className="feed-msg"><strong>[{m.tag}]</strong> {m.msg}</span>
        </div>
      ))}
    </div>
  );
}

function DistrictBars() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(()=>setReady(true), 800); return ()=>clearTimeout(t); }, []);
  return (
    <div className="district-bars">
      {DISTRICTS.map(d => (
        <div key={d.name} className="district-row">
          <div className="district-name">{d.name}</div>
          <div className="district-bar-bg">
            <div className="district-bar-fill"
              style={{width: ready ? `${d.pct}%` : "0%", background: d.color, boxShadow:`0 0 8px ${d.color}66`, transition:"width 2s cubic-bezier(0.25,1,0.5,1)"}}>
              {d.meals} meals
            </div>
          </div>
          <div className="district-pct" style={{color:d.color}}>{d.pct}%</div>
        </div>
      ))}
    </div>
  );
}

function ImpactMatrix({ extraMeals, extraPeople, extraFood, messages, onAssign }) {
  return (
    <section id="impact" className="section visible">
      <div className="section-header">
        <h2 className="section-title"><span className="title-bracket">[</span> IMPACT MATRIX <span className="title-bracket">]</span></h2>
        <span className="section-tag">REAL-TIME FEED // ENCRYPTED</span>
      </div>
      <div className="stats-grid">
        <StatCard stat="meals"  icon="🍽" label="MEALS SAVED TODAY" color="green"  target={1847 + extraMeals}  maxVal={3000}/>
        <StatCard stat="people" icon="👥" label="PEOPLE FED"        color="purple" target={923  + extraPeople} maxVal={2000}/>
        <StatCard stat="food"   icon="📦" label="KG FOOD RESCUED"   color="orange" target={742  + extraFood}   maxVal={1500}/>
        <StatCard stat="routes" icon="🛰" label="ACTIVE ROUTES"     color="cyan"   target={12}                 maxVal={20}/>
      </div>

      <div className="live-feed-panel">
        <h3 className="sub-title">◈ LIVE OPERATION FEED</h3>
        <LiveFeed messages={messages}/>
      </div>

      <div className="district-grid">
        <h3 className="sub-title">◈ DISTRICT IMPACT</h3>
        <DistrictBars/>
      </div>
    </section>
  );
}

// =============================================
// MAIN APP
// =============================================
export default function App() {
  const [panicMode, setPanicMode] = useState(false);
  const [activeSection, setActiveSection] = useState("map");
  const [feedMessages, setFeedMessages] = useState([]);
  const [extraMeals, setExtraMeals] = useState(0);
  const [extraPeople, setExtraPeople] = useState(0);
  const [extraFood, setExtraFood]   = useState(0);

  const nowStr = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
  };

  const addFeed = useCallback((color, tag, msg) => {
    setFeedMessages(prev => [...prev.slice(-39), { color, tag, msg, time: nowStr() }]);
  }, []);

  // Seed initial messages
  useEffect(() => {
    const seeds = [
      ["green",  "SYSTEM",  "ShadowMeal URN v2.7.1 initialized — all systems LIVE"],
      ["purple", "ENCRYPT", "AES-512 encryption engaged. Communications scrambled."],
      ["cyan",   "MAP",     "Smuggler's map loaded — 12 active routes detected"],
      ["orange", "ALERT",   "5 hunger zones identified — operations commencing"],
    ];
    seeds.forEach(([c,t,m]) => addFeed(c,t,m));
  }, [addFeed]);

  // Auto feed
  useEffect(() => {
    const t = setInterval(() => {
      const tpl = FEED_TEMPLATES[Math.floor(Math.random() * FEED_TEMPLATES.length)];
      addFeed(tpl[0], tpl[1], tpl[2]);
    }, 5000);
    return () => clearInterval(t);
  }, [addFeed]);

  // Auto ticker
  useEffect(() => {
    const t = setInterval(() => {
      setExtraMeals(m => m + Math.floor(Math.random()*3)+1);
      setExtraPeople(p => p + Math.floor(Math.random()*2)+1);
      setExtraFood(f => f + Math.floor(Math.random()*2));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = e => {
      if (e.key === "Escape" && panicMode) setPanicMode(false);
      if (e.key === "p" && !panicMode) setPanicMode(true);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [panicMode]);

  const handleIntercept = (item) => {
    addFeed("green", "INTERCEPT", `${item.name} intercepted — en route to hunger zone`);
    setExtraMeals(m => m + Math.floor(item.qty * 1.2));
    setExtraPeople(p => p + Math.floor(item.qty * 0.6));
    setExtraFood(f => f + Math.floor(item.qty * 0.8));
  };

  const handleAssign = (vol) => {
    addFeed("cyan", "VOLUNTEER", `${vol.name} assigned — heading to ${vol.zone}`);
  };

  if (panicMode) return <PanicScreen onBack={() => { setPanicMode(false); addFeed("purple","SYSTEM","Cover screen deactivated"); }}/>;

  return (
    <div id="mainApp">
      <Header onPanic={() => setPanicMode(true)} activeSection={activeSection} onNavClick={setActiveSection}/>
      <Ticker/>
      <main className="main-content">
        <SmugglersMap/>
        <SurplusStash onIntercept={handleIntercept}/>
        <DroneHub onAssign={handleAssign}/>
        <ImpactMatrix
          extraMeals={extraMeals} extraPeople={extraPeople} extraFood={extraFood}
          messages={feedMessages} onAssign={handleAssign}
        />
      </main>
      <footer className="footer">
        <span>SHADOWMEAL URN v2.7.1 // ENCRYPTED // ALL ROUTES SCRAMBLED</span>
        <FooterClock/>
      </footer>
    </div>
  );
}

function FooterClock() {
  const [ts, setTs] = useState("");
  useEffect(() => {
    const update = () => setTs(new Date().toISOString().replace("T"," ").slice(0,19) + " UTC");
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);
  return <span>TIMESTAMP: {ts}</span>;
}
