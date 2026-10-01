/* ============================================================
   Abhishek — 3D Portfolio (main.js)
   Single-page immersive portfolio, HTML/CSS/JS + Three.js + GSAP.

   Architecture
   - One fixed full-screen WebGL canvas behind the DOM
   - Ambient layer: particle field + floating wireframe shapes (parallax to mouse)
   - Skills layer: glowing core + two tilted orbit rings with labeled
     skill sprites — fades in only around the Skills section
   - Camera: scroll-driven keyframe path between the 5 sections,
     smoothed with lerp; plus subtle mouse parallax on top
   - Projects: DOM cards with CSS 3D tilt on hover + detail modal on click
   - Fallbacks: no-WebGL (CSS gradient only), prefers-reduced-motion
     (static frame, no loop), mobile (fewer particles, capped DPR)

   Customize: CONFIG below (skills/colors), index.html (content),
   style.css (:root variables).
   ============================================================ */

// ---------- Config ----------
const CONFIG = {
  skills: ["C", "C++", "Python", "JavaScript", "TypeScript", "React", "Node.js", "Solidity"],
  colors: { cyan: 0x22d3ee, purple: 0xa78bfa, pink: 0xf472b6, green: 0x34d399 },
};

// ---------- Environment flags ----------
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.matchMedia("(max-width: 768px)").matches || "ontouchstart" in window;
const SECTION_IDS = ["hero", "about", "skills", "projects", "contact"];

/* ============================================================
   1. Project data + detail modal (plain DOM — works without WebGL)
   ============================================================ */
// TODO: replace these placeholder projects with your real ones
const PROJECTS = [
  {
    icon: "🧠",
    name: "AI from scratch",
    tagline: "Machine learning fundamentals from first principles — no black boxes.",
    desc: "A hands-on project where I implement core ML algorithms from scratch — gradients, optimizers, attention — to understand what happens beneath the abstractions before shipping real AI features on top of them.",
    tech: ["Python", "NumPy", "ML fundamentals", "LLMs"],
    link: "https://github.com/abhskyd",
  },
  {
    icon: "🛠️",
    name: "Systems playground",
    tagline: "Low-level experiments in C — what actually happens under the hood.",
    desc: "A growing collection of C experiments exploring memory layout, pointers, processes, and system calls. Built to build the deep systems intuition I want for GSoC-level contributions.",
    tech: ["C", "Make", "gdb", "Linux"],
    link: "https://github.com/abhskyd",
  },
  {
    icon: "⛓️",
    name: "Web3 explorer",
    tagline: "Smart contracts and dApp experiments on the decentralized path.",
    desc: "Learning web3 by building: writing and testing Solidity smart contracts, wiring them to a front end, and understanding how decentralized systems differ from traditional full-stack apps.",
    tech: ["Solidity", "JavaScript", "Hardhat", "Ethers.js"],
    link: "https://github.com/abhskyd",
  },
];

// --- Modal ---
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
let lastFocus = null;

function openModal(i) {
  const p = PROJECTS[i];
  if (!p) return;
  modalBody.innerHTML = `
    <div class="modal-icon" aria-hidden="true">${p.icon}</div>
    <h3 id="modal-title">${p.name}</h3>
    <p class="modal-tagline">${p.tagline}</p>
    <p>${p.desc}</p>
    <div class="modal-tech">${p.tech.map((t) => `<span>${t}</span>`).join("")}</div>
    <a class="btn btn-primary" href="${p.link}" target="_blank" rel="noopener">View on GitHub ↗</a>
  `;
  lastFocus = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

document.querySelectorAll("[data-project]").forEach((el) => {
  el.addEventListener("click", () => openModal(Number(el.dataset.project)));
});
modal.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});

// --- CSS 3D tilt on project cards (desktop only, skipped for reduced motion) ---
if (!prefersReducedMotion && !isMobile) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

/* ============================================================
   2. Loading screen (progress indicator)
   ============================================================ */
const loaderEl = document.getElementById("loader");
const loaderBar = document.getElementById("loader-bar");
const loaderPct = document.getElementById("loader-pct");
let progress = 0;
let displayed = 0;
let loaderDone = false;

function setProgress(p) { progress = Math.max(progress, p); }

function tickLoader() {
  displayed += (progress - displayed) * 0.12;
  if (progress >= 100 && progress - displayed < 0.5) displayed = 100;
  loaderBar.style.width = displayed + "%";
  loaderPct.textContent = Math.round(displayed) + "%";
  if (displayed >= 100) { finishLoading(); return; }
  requestAnimationFrame(tickLoader);
}
requestAnimationFrame(tickLoader);

function finishLoading() {
  if (loaderDone) return;
  loaderDone = true;
  loaderEl.classList.add("done");

  // Intro animation (GSAP) — skipped for reduced motion or if GSAP failed to load
  if (!prefersReducedMotion && window.gsap) {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".nav", { y: -28, opacity: 0, duration: 0.7 }, 0.1)
      .from(".hero-tag", { y: 24, opacity: 0, duration: 0.6 }, 0.3)
      .from(".hero h1", { y: 34, opacity: 0, duration: 0.8 }, 0.45)
      .from(".hero-role", { y: 22, opacity: 0, duration: 0.6 }, 0.7)
      .from(".hero-sub", { y: 18, opacity: 0, duration: 0.5 }, 0.85)
      .from(".hero-cta .btn", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, 0.95)
      .from(".scroll-hint", { opacity: 0, duration: 0.6 }, 1.3);
  }

  // Scroll reveals (IntersectionObserver)
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

// Hard cap so the loader never sticks (e.g. offline fonts)
setTimeout(() => setProgress(100), 4000);

/* ============================================================
   3. Shared 3D state + helpers (declared before the loop uses them)
   ============================================================ */
let THREE = null;     // populated in Kickoff (dynamic import)
let threeRefs = null; // { renderer, scene, camera, particles, heroGroup, skills }
const mouse = { x: 0, y: 0 }; // normalized -1..1

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}, { passive: true });

// Scroll progress: continuous 0..(sections-1)
function getScrollT() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  const p = Math.min(1, Math.max(0, window.scrollY / max));
  return p * (SECTION_IDS.length - 1);
}

// ---------- Scene builders (function declarations — hoisted) ----------

function wireframe(geo, color, opacity) {
  return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity }));
}

function buildParticles() {
  const count = isMobile ? 250 : 800;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [CONFIG.colors.cyan, CONFIG.colors.purple, CONFIG.colors.pink].map((c) => new THREE.Color(c));
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.08, vertexColors: true, transparent: true, opacity: 0.7,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}

function buildHeroGroup() {
  const g = new THREE.Group();
  const addFloat = (mesh, amp, speed, rot) => {
    mesh.userData.float = { amp, speed, phase: Math.random() * Math.PI * 2, rot };
    mesh.userData.baseY = mesh.position.y;
    g.add(mesh);
    return mesh;
  };

  // Large wireframe icosahedron (left)
  const ico = addFloat(wireframe(new THREE.IcosahedronGeometry(2.3, 1), CONFIG.colors.cyan, 0.5), 0.35, 0.6, [0.0015, 0.0022]);
  ico.position.set(-4.8, 0.5, -2);

  // Torus knot (right) — solid with a wireframe overlay child
  const knot = addFloat(
    new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.05, 0.3, isMobile ? 72 : 128, isMobile ? 8 : 16),
      new THREE.MeshStandardMaterial({
        color: 0x1a2340, metalness: 0.6, roughness: 0.25,
        emissive: CONFIG.colors.purple, emissiveIntensity: 0.35,
      })
    ),
    0.3, 0.5, [0.0008, 0.0015]
  );
  knot.position.set(4.8, -0.5, -1);
  const knotWire = wireframe(new THREE.TorusKnotGeometry(1.05, 0.32, 64, 8), CONFIG.colors.purple, 0.22);
  knotWire.scale.setScalar(1.03);
  knot.add(knotWire);

  // Smaller accents
  const octa = addFloat(wireframe(new THREE.OctahedronGeometry(0.85, 0), CONFIG.colors.green, 0.65), 0.28, 0.8, [0.002, 0.003]);
  octa.position.set(2.6, 2.3, -3);
  const ico2 = addFloat(wireframe(new THREE.IcosahedronGeometry(0.7, 0), CONFIG.colors.purple, 0.5), 0.25, 0.7, [0.002, -0.002]);
  ico2.position.set(-2.2, -2.4, -2.5);

  // Tiny glowing spheres
  const dots = [
    [CONFIG.colors.cyan, [-1.2, 2.6, -4]],
    [CONFIG.colors.pink, [1.0, -2.8, -3.5]],
    [CONFIG.colors.green, [5.6, 2.4, -4]],
  ];
  dots.forEach(([color, pos]) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 12, 12),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 })
    );
    m.position.set(...pos);
    g.add(m);
  });

  return g;
}

function buildSkillsGroup() {
  const g = new THREE.Group();

  // Glowing core + wireframe shell
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.9, 1),
    new THREE.MeshStandardMaterial({
      color: 0x141c38, metalness: 0.55, roughness: 0.3,
      emissive: CONFIG.colors.cyan, emissiveIntensity: 0.5,
    })
  );
  const shell = wireframe(new THREE.IcosahedronGeometry(1.05, 1), CONFIG.colors.cyan, 0.3);
  g.add(core, shell);

  // Two tilted orbit rings; skills split across them
  const ringDefs = [
    { r: 2.5, tilt: [1.15, 0, 0.35], color: CONFIG.colors.cyan, speed: 0.35, label: "#22d3ee" },
    { r: 3.3, tilt: [1.9, 0, -0.5], color: CONFIG.colors.purple, speed: -0.25, label: "#a78bfa" },
  ];
  const planes = ringDefs.map((def) => {
    const plane = new THREE.Group();
    plane.rotation.set(def.tilt[0], def.tilt[1], def.tilt[2]);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(def.r, 0.012, 8, 120),
      new THREE.MeshBasicMaterial({ color: def.color, transparent: true, opacity: 0.35 })
    );
    ring.rotation.x = Math.PI / 2; // lie flat in the tilted plane
    plane.add(ring);
    g.add(plane);
    return { plane, def };
  });

  const orbiters = [];
  CONFIG.skills.forEach((skill, i) => {
    const { plane, def } = planes[i % 2];
    const pivot = new THREE.Group();
    pivot.rotation.y = (i / CONFIG.skills.length) * Math.PI * 4; // spread around the circle
    const sprite = makeTextSprite(skill, def.label);
    sprite.position.x = def.r;
    pivot.add(sprite);
    plane.add(pivot);
    orbiters.push({ pivot, speed: def.speed * (0.8 + 0.4 * Math.random()) });
  });

  g.position.set(0, 0, -1.5);
  return { group: g, orbiters };
}

// Text label rendered to a canvas → sprite (always faces the camera)
function makeTextSprite(text, colorCss) {
  const pad = 26, fontSize = 44;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;
  const w = Math.ceil(ctx.measureText(text).width);
  c.width = w + pad * 2;
  c.height = Math.ceil(fontSize * 1.9);
  ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`; // reset after resize

  roundedRect(ctx, 0, 0, c.width, c.height, 18);
  ctx.fillStyle = "rgba(13, 20, 38, 0.85)";
  ctx.fill();
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = colorCss;
  ctx.lineWidth = 2;
  roundedRect(ctx, 0, 0, c.width, c.height, 18);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = colorCss;
  ctx.textBaseline = "middle";
  ctx.fillText(text, pad, c.height / 2 + 2);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.95, depthWrite: false }));
  sprite.scale.set(c.width * 0.011, c.height * 0.011, 1);
  return sprite;
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Fade a whole group by multiplying every material's opacity
function setGroupOpacity(group, factor) {
  group.visible = factor > 0.02;
  if (!group.visible) return;
  group.traverse((obj) => {
    const mat = obj.material;
    if (!mat) return;
    if (mat.userData.baseOpacity === undefined) mat.userData.baseOpacity = mat.opacity;
    mat.opacity = mat.userData.baseOpacity * factor;
    mat.transparent = true;
  });
}

// Skills orbit is only visible around the Skills section (index 2)
function skillsFactor(scrollT) {
  const d = Math.abs(scrollT - 2);
  const f = THREE.MathUtils.clamp(1 - d * 0.85, 0, 1);
  return f * f * (3 - 2 * f); // smoothstep
}

/* ============================================================
   4. Scene bootstrap + animation loop
   ============================================================ */

// Camera keyframes — one per section: [hero, about, skills, projects, contact]
const camKeys = [
  { pos: [0, 0.2, 14], look: [0, 0, 0] },
  { pos: [-2.6, 0.4, 12.5], look: [0.8, 0, 0] },
  { pos: [2.6, -0.3, 11.5], look: [-0.8, 0, 0] },
  { pos: [0, 0.6, 13], look: [0, -0.4, 0] },
  { pos: [0, -0.4, 14.5], look: [0, 0.6, 0] },
];

function camTarget(scrollT) {
  const i = Math.min(camKeys.length - 2, Math.max(0, Math.floor(scrollT)));
  const f = THREE.MathUtils.clamp(scrollT - i, 0, 1);
  const e = f * f * (3 - 2 * f); // smoothstep
  const a = camKeys[i], b = camKeys[i + 1];
  const L = (u, v) => u + (v - u) * e;
  return {
    pos: [L(a.pos[0], b.pos[0]), L(a.pos[1], b.pos[1]), L(a.pos[2], b.pos[2])],
    look: [L(a.look[0], b.look[0]), L(a.look[1], b.look[1]), L(a.look[2], b.look[2])],
  };
}

const clock = new THREE.Clock();
let raf = 0;
let running = false;
let skillsOpacity = 0;
const lookAtVec = new THREE.Vector3(0, 0, 0);
const tmpLook = new THREE.Vector3();

function initScene() {
  const canvas = document.getElementById("bg3d");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null; // no WebGL support → CSS gradient fallback
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0e1a, 16, 42);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.2, 14);

  // Soft lighting (only the few standard materials need it — the rest are unlit)
  scene.add(new THREE.AmbientLight(0xbfd4ff, 0.7));
  const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
  dirLight.position.set(5, 8, 6);
  scene.add(dirLight);
  const pointLight = new THREE.PointLight(0xa78bfa, 30, 0, 2);
  pointLight.position.set(-6, 3, 3);
  scene.add(pointLight);

  // Ambient particle field + floating shapes + skills orbit
  const particles = buildParticles();
  scene.add(particles);
  const heroGroup = buildHeroGroup();
  scene.add(heroGroup);
  const skills = buildSkillsGroup();
  scene.add(skills.group);

  fitScene();

  function fitScene() {
    const scale = THREE.MathUtils.clamp(camera.aspect / 1.6, 0.55, 1);
    heroGroup.scale.setScalar(scale);
    skills.group.scale.setScalar(Math.min(1, scale + 0.15));
  }

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    fitScene();
    if (prefersReducedMotion) renderStaticFrame();
  });

  // Graceful context loss
  canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); stopLoop(); });
  canvas.addEventListener("webglcontextrestored", () => startLoop());

  return { renderer, scene, camera, particles, heroGroup, skills };
}

function startLoop() {
  if (!threeRefs || running || prefersReducedMotion) return;
  running = true;
  clock.getDelta();
  animate();
}

function stopLoop() {
  running = false;
  cancelAnimationFrame(raf);
}

function animate() {
  if (!running) return;
  raf = requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.getElapsedTime();
  const scrollT = getScrollT();
  const { renderer, scene, camera, particles, heroGroup, skills } = threeRefs;

  // Camera: keyframe path + mouse parallax, smoothed with lerp
  const tgt = camTarget(scrollT);
  camera.position.x += (tgt.pos[0] + mouse.x * 0.5 - camera.position.x) * 0.045;
  camera.position.y += (tgt.pos[1] + mouse.y * 0.35 - camera.position.y) * 0.045;
  camera.position.z += (tgt.pos[2] - camera.position.z) * 0.045;
  tmpLook.set(tgt.look[0], tgt.look[1], tgt.look[2]);
  lookAtVec.lerp(tmpLook, 0.05);
  camera.lookAt(lookAtVec);

  // Hero shapes: gentle float + slow rotation
  heroGroup.children.forEach((m) => {
    const fl = m.userData.float;
    if (!fl) return;
    m.position.y = fl.baseY + Math.sin(t * fl.speed + fl.phase) * fl.amp;
    m.rotation.x += fl.rot[0] * dt * 60;
    m.rotation.y += fl.rot[1] * dt * 60;
  });
  heroGroup.rotation.y = t * 0.05 + mouse.x * 0.08;

  // Skills orbit: rotate orbiters, fade with section proximity
  skills.orbiters.forEach((o) => { o.pivot.rotation.y += o.speed * dt; });
  skillsOpacity += (skillsFactor(scrollT) - skillsOpacity) * 0.06;
  setGroupOpacity(skills.group, skillsOpacity);

  // Particles: slow drift + mouse parallax
  particles.rotation.y = t * 0.015;
  particles.position.x += (mouse.x * 0.8 - particles.position.x) * 0.02;
  particles.position.y += (mouse.y * 0.5 - particles.position.y) * 0.02;

  renderer.render(scene, camera);
}

// Reduced motion: render a single static frame, no loop
function renderStaticFrame() {
  if (!threeRefs) return;
  const { renderer, scene, camera } = threeRefs;
  camera.position.set(0, 0.2, 14);
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}

// Pause rendering when the tab is hidden (battery / CPU friendly)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopLoop();
  else startLoop();
});

/* ============================================================
   5. Kickoff — load Three.js, build the scene, start
   ============================================================ */
try {
  THREE = await import("three"); // top-level await: page still works if the CDN is unreachable
} catch {
  document.body.classList.add("no-webgl");
}

if (THREE) {
  threeRefs = initScene();
  if (threeRefs) {
    if (prefersReducedMotion) renderStaticFrame();
    else startLoop();
  } else {
    document.body.classList.add("no-webgl");
  }
}

setProgress(threeRefs ? 75 : 100);
document.fonts.ready.then(() => setProgress(100)).catch(() => setProgress(100));
