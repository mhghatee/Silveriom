/**
 * SILVERIOM — The Art of Sports Branding
 * Luxury 3D Experience (Rolex / Apple / Porsche Aesthetics)
 * Three.js + GSAP ScrollTrigger
 */

// ==========================================
// 1. SCENE, CAMERA & RENDERER INITIALIZATION
// ==========================================
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020617, 0.035);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 9.5);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

// ==========================================
// 2. LUXURY STUDIO LIGHTING RIG (ROLEX COMMERCIAL STYLE)
// ==========================================
// Ambient Fill (Deep Midnight Ocean)
const ambientLight = new THREE.AmbientLight(0x071A2E, 0.9);
scene.add(ambientLight);

// Key Light (Warm Champagne Studio Spotlight)
const keyLight = new THREE.DirectionalLight(0xFFF2DC, 2.2);
keyLight.position.set(5, 8, 8);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.bias = -0.0001;
scene.add(keyLight);

// Rim Light (Metallic Silver Accent)
const silverRimLight = new THREE.DirectionalLight(0xD9D9D9, 2.8);
silverRimLight.position.set(-8, 3, -6);
scene.add(silverRimLight);

// Subtle Court Glow (Minimal Tennis Court Green)
const subtleCourtGlow = new THREE.DirectionalLight(0x0B2A1A, 1.4);
subtleCourtGlow.position.set(0, -6, 4);
scene.add(subtleCourtGlow);

// Interactive Cursor Spotlight
const cursorSpot = new THREE.PointLight(0xBFA77A, 1.5, 12);
cursorSpot.position.set(0, 0, 4);
scene.add(cursorSpot);

// ==========================================
// 3. PROCEDURAL TEXTURES (FELT & CARBON FIBER)
// ==========================================

// Ultra-realistic Tennis Ball Felt
function createTennisFeltTexture() {
  const size = 1024;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');

  // Base Optic Yellow with soft velvet gradient
  const grad = ctx.createRadialGradient(size/2, size/2, 50, size/2, size/2, size/2);
  grad.addColorStop(0, '#d2e823');
  grad.addColorStop(0.7, '#c2db1b');
  grad.addColorStop(1, '#9eb810');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Micro-felt noise
  const imgData = ctx.getImageData(0, 0, size, size);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 28;
    d[i] = Math.min(255, Math.max(0, d[i] + n));
    d[i+1] = Math.min(255, Math.max(0, d[i+1] + n));
    d[i+2] = Math.min(255, Math.max(0, d[i+2] + n * 0.4));
  }
  ctx.putImageData(imgData, 0, 0);

  // Precision Seam Groove
  ctx.lineWidth = 24;
  ctx.strokeStyle = '#f5f5f7';
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(0, size * 0.25);
  ctx.bezierCurveTo(size * 0.25, size * 0.1, size * 0.75, size * 0.9, size, size * 0.75);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, size * 0.75);
  ctx.bezierCurveTo(size * 0.25, size * 0.9, size * 0.75, size * 0.1, size, size * 0.25);
  ctx.stroke();

  const colorMap = new THREE.CanvasTexture(c);
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;

  // Bump map for felt fibers
  const bc = document.createElement('canvas');
  bc.width = 512;
  bc.height = 512;
  const bCtx = bc.getContext('2d');
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 512, 512);
  const bData = bCtx.getImageData(0, 0, 512, 512);
  for (let i = 0; i < bData.data.length; i += 4) {
    const noise = Math.floor(Math.random() * 255);
    bData.data[i] = noise;
    bData.data[i+1] = noise;
    bData.data[i+2] = noise;
  }
  bCtx.putImageData(bData, 0, 0);
  const bumpMap = new THREE.CanvasTexture(bc);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(6, 6);

  return { colorMap, bumpMap };
}

// 12K Carbon Fiber Twill Weave
function createCarbonTwillTexture() {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = '#1c1c22';
  for (let x = 0; x < size; x += 16) {
    for (let y = 0; y < size; y += 16) {
      if ((x / 16 + y / 16) % 2 === 0) {
        ctx.fillRect(x, y, 16, 8);
        ctx.fillStyle = '#141418';
        ctx.fillRect(x, y + 8, 16, 8);
        ctx.fillStyle = '#1c1c22';
      }
    }
  }

  const texture = new THREE.CanvasTexture(c);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  return texture;
}

// ==========================================
// 4. 3D HERO OBJECTS: BALL & PADEL RACKET
// ==========================================

// --- OBJECT 1: LUXURY TENNIS BALL ---
const ballGroup = new THREE.Group();
const ballTex = createTennisFeltTexture();

const ballGeometry = new THREE.SphereGeometry(1.4, 64, 64);
const ballMaterial = new THREE.MeshStandardMaterial({
  map: ballTex.colorMap,
  bumpMap: ballTex.bumpMap,
  bumpScale: 0.05,
  roughness: 0.8,
  metalness: 0.05
});

const tennisBall = new THREE.Mesh(ballGeometry, ballMaterial);
tennisBall.castShadow = true;
tennisBall.receiveShadow = true;
ballGroup.add(tennisBall);

// Initial position: centered-right
ballGroup.position.set(1.6, 0.1, 0);
scene.add(ballGroup);

// --- OBJECT 2: PROFESSIONAL CARBON FIBER PADEL RACKET ---
const racketGroup = new THREE.Group();
const carbonTex = createCarbonTwillTexture();

// Diamond Head Shape
const headShape = new THREE.Shape();
const hw = 1.9, hh = 2.4;
headShape.moveTo(0, hh);
headShape.bezierCurveTo(hw * 0.8, hh, hw, hh * 0.6, hw, 0);
headShape.bezierCurveTo(hw, -hh * 0.6, hw * 0.6, -hh * 0.9, 0, -hh);
headShape.bezierCurveTo(-hw * 0.6, -hh * 0.9, -hw, -hh * 0.6, -hw, 0);
headShape.bezierCurveTo(-hw, hh * 0.6, -hw * 0.8, hh, 0, hh);

const extrudeSettings = {
  depth: 0.32,
  bevelEnabled: true,
  bevelSegments: 5,
  steps: 1,
  bevelSize: 0.1,
  bevelThickness: 0.1
};

const racketHeadGeo = new THREE.ExtrudeGeometry(headShape, extrudeSettings);
racketHeadGeo.center();

const carbonMat = new THREE.MeshStandardMaterial({
  map: carbonTex,
  roughness: 0.3,
  metalness: 0.55,
  color: 0x222228
});

const racketHead = new THREE.Mesh(racketHeadGeo, carbonMat);
racketHead.castShadow = true;
racketHead.receiveShadow = true;
racketGroup.add(racketHead);

// Perforation Matrix
const holeGroup = new THREE.Group();
const holeGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.55, 12);
const holeMat = new THREE.MeshStandardMaterial({ color: 0x050508, roughness: 0.9 });

for (let r = -1.1; r <= 1.1; r += 0.38) {
  for (let c = -1.3; c <= 1.3; c += 0.38) {
    if (r*r / (1.3*1.3) + c*c / (1.5*1.5) < 0.75) {
      const hole = new THREE.Mesh(holeGeo, holeMat);
      hole.rotation.x = Math.PI / 2;
      hole.position.set(r, c, 0);
      holeGroup.add(hole);
    }
  }
}
racketGroup.add(holeGroup);

// Metallic Silver Bevel Frame Rim
const rimGeo = new THREE.TorusGeometry(2.05, 0.025, 16, 64);
const rimMat = new THREE.MeshStandardMaterial({
  color: 0xD9D9D9,
  metalness: 0.9,
  roughness: 0.15
});
const rimMesh = new THREE.Mesh(rimGeo, rimMat);
rimMesh.scale.set(0.92, 1.12, 1);
rimMesh.position.z = 0.18;
racketGroup.add(rimMesh);

// Aerodynamic Throat
const throatGeo = new THREE.CylinderGeometry(0.25, 0.38, 0.85, 16);
const throatMesh = new THREE.Mesh(throatGeo, carbonMat);
throatMesh.position.set(0, -2.7, 0);
racketGroup.add(throatMesh);

// Luxury Leather-Wrapped Handle
const handleGeo = new THREE.CylinderGeometry(0.24, 0.28, 2.3, 16);
const handleMat = new THREE.MeshStandardMaterial({
  color: 0x151518,
  roughness: 0.75,
  metalness: 0.1
});
const handleMesh = new THREE.Mesh(handleGeo, handleMat);
handleMesh.position.set(0, -4.1, 0);
racketGroup.add(handleMesh);

// Champagne Gold Ring Detail
const goldRingGeo = new THREE.TorusGeometry(0.26, 0.02, 16, 32);
const goldRingMat = new THREE.MeshStandardMaterial({ color: 0xBFA77A, metalness: 0.9, roughness: 0.1 });
const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
goldRing.position.set(0, -3.05, 0);
racketGroup.add(goldRing);

// Butt Cap with Silver Monogram
const buttCapGeo = new THREE.CylinderGeometry(0.32, 0.36, 0.22, 16);
const buttCapMat = new THREE.MeshStandardMaterial({ color: 0xD9D9D9, metalness: 0.85, roughness: 0.2 });
const buttCap = new THREE.Mesh(buttCapGeo, buttCapMat);
buttCap.position.set(0, -5.3, 0);
racketGroup.add(buttCap);

// Initial racket in Hero: elegant composition behind ball
racketGroup.position.set(3.2, -0.4, -2.5);
racketGroup.rotation.set(0.2, -0.45, 0.1);
racketGroup.scale.set(0.85, 0.85, 0.85);
scene.add(racketGroup);

// --- OBJECT 3: 3D METALLIC SILVERIOM LOGO (FINALE) ---
const monogramGroup = new THREE.Group();
const ring1Geo = new THREE.TorusGeometry(2.4, 0.04, 16, 64);
const ring1Mat = new THREE.MeshStandardMaterial({ color: 0xD9D9D9, metalness: 0.95, roughness: 0.1 });
const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);

const ring2Geo = new THREE.TorusGeometry(1.8, 0.03, 16, 64);
const ring2Mat = new THREE.MeshStandardMaterial({ color: 0xBFA77A, metalness: 0.9, roughness: 0.15 });
const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);

monogramGroup.add(ring1);
monogramGroup.add(ring2);
monogramGroup.position.set(0, 0, -20);
monogramGroup.scale.set(0.001, 0.001, 0.001);
scene.add(monogramGroup);

// --- ATMOSPHERIC DUST MOTES (NIGHT STADIUM AIR) ---
const dustCount = 450;
const dustGeo = new THREE.BufferGeometry();
const dustPos = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount * 3; i += 3) {
  dustPos[i] = (Math.random() - 0.5) * 40;
  dustPos[i+1] = (Math.random() - 0.5) * 30;
  dustPos[i+2] = (Math.random() - 0.5) * 30;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
const dustMat = new THREE.PointsMaterial({
  color: 0xBFA77A,
  size: 0.05,
  transparent: true,
  opacity: 0.35
});
const dustParticles = new THREE.Points(dustGeo, dustMat);
scene.add(dustParticles);

// ==========================================
// 5. GSAP SCROLL STORY CHOREOGRAPHY
// ==========================================
gsap.registerPlugin(ScrollTrigger);

function initScrollStory() {
  // Timeline 1: Chapter 01 (Tennis Heritage)
  const tlCh1 = gsap.timeline({
    scrollTrigger: {
      trigger: '#chapter-1',
      start: 'top bottom',
      end: 'center center',
      scrub: 1.5
    }
  });

  tlCh1.to(camera.position, {
    x: -0.5,
    y: 0.2,
    z: 7.5,
    ease: 'power1.inOut'
  }, 0);

  tlCh1.to(ballGroup.position, {
    x: 1.8,
    y: 0.3,
    z: 0.8,
    ease: 'power1.inOut'
  }, 0);

  tlCh1.to(racketGroup.position, {
    x: 5.5,
    y: -1.0,
    z: -4,
    ease: 'power1.inOut'
  }, 0);

  // Timeline 2: Chapter 02 (Padel Evolution)
  const tlCh2 = gsap.timeline({
    scrollTrigger: {
      trigger: '#chapter-2',
      start: 'top bottom',
      end: 'center center',
      scrub: 1.5
    }
  });

  tlCh2.to(camera.position, {
    x: 0.8,
    y: -0.2,
    z: 7.8,
    ease: 'power1.inOut'
  }, 0);

  tlCh2.to(racketGroup.position, {
    x: -1.8,
    y: 0.2,
    z: 0.5,
    ease: 'power1.inOut'
  }, 0);

  tlCh2.to(racketGroup.rotation, {
    x: 0.1,
    y: 0.35,
    z: -0.05,
    ease: 'power1.inOut'
  }, 0);

  tlCh2.to(ballGroup.position, {
    x: -4.5,
    y: -0.5,
    z: -3,
    ease: 'power1.inOut'
  }, 0);

  // Timeline 3: Brand Experiences & Capabilities
  const tlExperiences = gsap.timeline({
    scrollTrigger: {
      trigger: '#experiences',
      start: 'top bottom',
      end: 'bottom center',
      scrub: 1.8
    }
  });

  tlExperiences.to(camera.position, {
    x: 0,
    y: 0.5,
    z: 8.5,
    ease: 'none'
  }, 0);

  tlExperiences.to(ballGroup.position, {
    x: 2.2,
    y: 0.8,
    z: -1,
    ease: 'none'
  }, 0);

  tlExperiences.to(racketGroup.position, {
    x: -2.4,
    y: -0.6,
    z: -1.5,
    ease: 'none'
  }, 0);

  // Timeline 4: Finale & Monogram Convergence
  const tlFinale = gsap.timeline({
    scrollTrigger: {
      trigger: '#contact',
      start: 'top bottom',
      end: 'center center',
      scrub: 1.5
    }
  });

  tlFinale.to(ballGroup.scale, { x: 0.01, y: 0.01, z: 0.01, ease: 'power2.in' }, 0);
  tlFinale.to(racketGroup.scale, { x: 0.01, y: 0.01, z: 0.01, ease: 'power2.in' }, 0);

  tlFinale.to(monogramGroup.scale, { x: 1, y: 1, z: 1, ease: 'power2.out' }, 0);
  tlFinale.to(monogramGroup.position, { x: 0, y: 0.8, z: 0, ease: 'power2.out' }, 0);
}

// ==========================================
// 6. MOUSE PARALLAX & LUXURY INTERACTION
// ==========================================
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

window.addEventListener('mousemove', (e) => {
  mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ==========================================
// 7. INQUIRY MODAL & MOBILE MENU HANDLERS
// ==========================================
function initInteractions() {
  const inquiryModal = document.getElementById('inquiry-modal');
  const closeInquiryBtn = document.getElementById('close-inquiry-btn');
  const triggers = document.querySelectorAll('#open-inquiry-btn, .open-inquiry-trigger');

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (inquiryModal) inquiryModal.classList.add('active');
    });
  });

  if (closeInquiryBtn && inquiryModal) {
    closeInquiryBtn.addEventListener('click', () => {
      inquiryModal.classList.remove('active');
    });
  }

  if (inquiryModal) {
    inquiryModal.addEventListener('click', (e) => {
      if (e.target === inquiryModal) {
        inquiryModal.classList.remove('active');
      }
    });
  }

  const form = document.getElementById('inquiry-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you. Your consultation request has been received by SILVERIOM Senior Partners.');
      inquiryModal.classList.remove('active');
      form.reset();
    });
  }

  // Mobile Menu
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMobile = document.getElementById('close-mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => mobileMenu.classList.add('active'));
  }
  if (closeMobile && mobileMenu) {
    closeMobile.addEventListener('click', () => mobileMenu.classList.remove('active'));
  }
}

// ==========================================
// 8. RENDER LOOP (MAJESTIC & REGAL MOTION)
// ==========================================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // Heavy inertia damping (ARRI Alexa dolly feel)
  mouse.x += (mouse.targetX - mouse.x) * 0.035;
  mouse.y += (mouse.targetY - mouse.y) * 0.035;

  // Regal slow rotation of tennis ball
  tennisBall.rotation.y += 0.0035;
  tennisBall.rotation.x = Math.sin(time * 0.3) * 0.1;

  // Subtle floating hover
  ballGroup.position.y += Math.sin(time * 1.5) * 0.0008;
  racketGroup.position.y += Math.cos(time * 1.2) * 0.0008;

  // Parallax shift
  ballGroup.rotation.y = mouse.x * 0.25;
  ballGroup.rotation.x = -mouse.y * 0.15;

  racketGroup.rotation.y = -0.45 + mouse.x * 0.15;
  racketGroup.rotation.x = 0.2 - mouse.y * 0.1;

  // Monogram slow orbit
  ring1.rotation.x = time * 0.3;
  ring1.rotation.y = time * 0.2;
  ring2.rotation.y = -time * 0.4;
  ring2.rotation.z = time * 0.25;

  // Atmospheric dust gentle drift
  dustParticles.rotation.y = time * 0.015;

  // Update cursor spotlight
  cursorSpot.position.x = mouse.x * 5;
  cursorSpot.position.y = mouse.y * 3.5;

  renderer.render(scene, camera);
}

// Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  initScrollStory();
  initInteractions();
  animate();
});
