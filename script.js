// DOMAIN CLASH: Gojo vs Sukuna — Cinematic Canvas Animation Engine

const frameCount = 12;
const framePaths = Array.from({ length: frameCount }, (_, i) =>
  `assets/scroll-frames/frame-${String(i).padStart(2, '0')}.jpg`
);

// Preload Images
const images = framePaths.map((src, i) => {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  return img;
});

// Story Content for each phase
const stories = [
  ['Domain Expansion', 'Two pinnacles of jujutsu activate their supreme barriers. Limitless Void meets Malevolent Shrine.'],
  ['Infinity Inverted', 'Neutral infinity bends under the violent spatial compression of Sukuna\'s domain boundary.'],
  ['Invisible Slashing', 'Relentless Dismantle blades test the limits of spatial infinity. Speed and power clash.'],
  ['The Barrier Collapses', 'An open barrier domain without walls encompasses the battlefield in relentless cursed energy.'],
  ['Spatial Compression', 'Pressure shatters the local atmosphere as Gojo counters with reversed cursed technique.'],
  ['The Climax Blitz', 'Neither sorcerer yields an inch. Every microsecond holds thousands of micro-collisions.'],
  ['Maximum Output: 120%', 'Both combatants push their cursed energy output beyond the absolute limits of human capability.'],
  ['Dismantle & Cleave', 'Malevolent Shrine slices through everything with cursed energy, attempting to breach infinity.'],
  ['Infinite Information', 'Limitless Void floods the spatial axis with endless stimuli, locking Sukuna in dead heat.'],
  ['The Final Exchange', 'Power meets power at the bleeding edge of jujutsu. Black flash sparks ignite.'],
  ['Domain Aftershock', 'The barriers shatter from mutual overload. Smoke and cursed dust blanket the ruins.'],
  ['Clash Resolved', 'The strongest sorcerers stand among the remnants. Scroll or replay to re-experience the collision.']
];

// Phase balance: [Void %, Shrine %]
const phaseBalance = [
  [50, 50],
  [55, 45],
  [45, 55],
  [40, 60],
  [48, 52],
  [50, 50],
  [52, 48],
  [44, 56],
  [58, 42],
  [50, 50],
  [49, 51],
  [50, 50]
];

// DOM Elements
const canvas = document.querySelector('#animationCanvas');
const ctx = canvas.getContext('2d', { alpha: false });
const scene = document.querySelector('#scrollScene');
const hero = document.querySelector('#hero');
const fill = document.querySelector('#timelineFill');
const thumb = document.querySelector('#timelineThumb');
const tooltip = document.querySelector('#timelineTooltip');
const timelineBar = document.querySelector('#timelineBar');
const counter = document.querySelector('#frameCounter');
const percent = document.querySelector('#scrollPercent');
const heading = document.querySelector('#storyHeading');
const body = document.querySelector('#storyBody');
const phase = document.querySelector('#storyBadge');
const energy = document.querySelector('#telemetryEnergy');
const subLabel = document.querySelector('#telemetrySub');
const targetLabel = document.querySelector('#telemetryTarget');
const balanceVoid = document.querySelector('#balanceVoid');
const balanceShrine = document.querySelector('#balanceShrine');
const soundBtn = document.querySelector('#soundBtn');
const playBtn = document.querySelector('#playBtn');
const speedBtn = document.querySelector('#speedBtn');
const heroPlayBtn = document.querySelector('#heroPlayBtn');
const replayBtn = document.querySelector('#replayBtn');

// State
let dpr = 1;
let current = 0;
let target = 0;
let lastProgress = -1;
let velocity = 0;
let prevCurrent = 0;
let autoPlay = false;
let playSpeed = 1.0;
let userScrubbing = false;

// Audio State
let audioCtx = null;
let masterGain = null;
let droneOsc = null;
let harmOsc = null;
let noiseNode = null;
let noiseGain = null;
let isAudioActive = false;

// Particles System (Cursed energy particles)
const particles = Array.from({ length: 45 }, () => ({
  x: Math.random(),
  y: Math.random(),
  size: 1 + Math.random() * 2.5,
  speedX: (Math.random() - 0.5) * 0.003,
  speedY: -0.002 - Math.random() * 0.004,
  alpha: 0.2 + Math.random() * 0.6,
  type: Math.random() > 0.5 ? 'blue' : 'red',
  phase: Math.random() * Math.PI * 2
}));

// Slashing FX (Sukuna cuts)
const slashes = [];
function triggerSlash(intensity = 1) {
  const angle = (Math.random() - 0.5) * 0.8 + (Math.random() > 0.5 ? 0.3 : -0.3);
  slashes.push({
    x1: Math.random() * window.innerWidth,
    y1: Math.random() * window.innerHeight * 0.4,
    len: (200 + Math.random() * 400) * intensity,
    angle,
    life: 1.0,
    width: 1.5 + Math.random() * 3 * intensity,
    color: Math.random() > 0.3 ? '#ff4654' : '#ffffff'
  });
  if (slashes.length > 8) slashes.shift();

  if (isAudioActive && audioCtx) {
    playSlashAudio();
  }
}

// Canvas Resize
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw(current);
}

// Main Canvas Renderer with Sub-Pixel Interpolation and Cursed Energy VFX
function draw(index) {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const floorIdx = Math.floor(index);
  const ceilIdx = Math.min(frameCount - 1, Math.ceil(index));
  const fract = index - floorIdx;

  const imgA = images[floorIdx];
  const imgB = images[ceilIdx];

  ctx.fillStyle = '#050508';
  ctx.fillRect(0, 0, w, h);

  if (!imgA || !imgA.complete || !imgA.naturalWidth) return;

  // Scale and center cover logic
  const scale = Math.max(w / imgA.naturalWidth, h / imgA.naturalHeight);
  // Micro dynamic zoom based on scroll progress and velocity
  const dynamicZoom = 1.0 + (index / (frameCount - 1)) * 0.04 + Math.min(0.04, velocity * 0.08);
  const totalScale = scale * dynamicZoom;

  const drawW = imgA.naturalWidth * totalScale;
  const drawH = imgA.naturalHeight * totalScale;

  // Camera shake when velocity is extreme or clash climax
  let shakeX = 0;
  let shakeY = 0;
  if (velocity > 0.08 || (index >= 6 && index <= 8 && Math.random() > 0.4)) {
    const shakeMag = Math.min(6, velocity * 25);
    shakeX = (Math.random() - 0.5) * shakeMag;
    shakeY = (Math.random() - 0.5) * shakeMag;
  }

  const posX = (w - drawW) / 2 + shakeX;
  const posY = (h - drawH) / 2 + shakeY;

  // Draw Primary Frame
  ctx.globalAlpha = 1;
  ctx.drawImage(imgA, posX, posY, drawW, drawH);

  // Crossfade Next Frame if active
  if (imgB && imgB !== imgA && imgB.complete && imgB.naturalWidth && fract > 0.001) {
    ctx.globalAlpha = fract;
    ctx.drawImage(imgB, posX, posY, drawW, drawH);
    ctx.globalAlpha = 1;
  }

  // Chromatic Aberration during high velocity
  if (velocity > 0.05 && imgA.complete) {
    const shift = Math.min(8, velocity * 40);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = Math.min(0.35, velocity * 1.5);

    // Red shift
    ctx.fillStyle = 'rgba(255, 70, 84, 0.2)';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(imgA, posX - shift, posY, drawW, drawH);

    // Cyan shift
    ctx.fillStyle = 'rgba(102, 217, 255, 0.2)';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(imgA, posX + shift, posY, drawW, drawH);

    ctx.restore();
  }

  // Render Cursed Particles Layer
  renderParticles(w, h, index);

  // Render Sukuna Slashes Layer
  renderSlashes(w, h);

  // Radial Clash Glow in Center
  const clashAlpha = Math.sin((index / (frameCount - 1)) * Math.PI) * 0.15 + (velocity * 0.2);
  if (clashAlpha > 0.02) {
    const grad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h) * 0.65);
    grad.addColorStop(0, 'rgba(179, 102, 255, ' + Math.min(0.3, clashAlpha) + ')');
    grad.addColorStop(0.5, 'rgba(255, 70, 84, ' + Math.min(0.2, clashAlpha * 0.8) + ')');
    grad.addColorStop(1, 'transparent');
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}

// Particle field rendering
function renderParticles(w, h, index) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const progressRatio = index / (frameCount - 1);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.phase += 0.02;
    p.x += p.speedX * (1 + velocity * 10);
    p.y += p.speedY * (1 + velocity * 10);

    // Wrap particles
    if (p.y < 0) p.y = 1;
    if (p.x < 0) p.x = 1;
    if (p.x > 1) p.x = 0;

    const px = p.x * w;
    const py = p.y * h + Math.sin(p.phase) * 6;

    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);

    // Color based on domain phase and particle type
    if (p.type === 'blue') {
      ctx.fillStyle = `rgba(102, 217, 255, ${p.alpha * (0.4 + (1 - progressRatio) * 0.6)})`;
    } else {
      ctx.fillStyle = `rgba(255, 70, 84, ${p.alpha * (0.4 + progressRatio * 0.6)})`;
    }
    ctx.fill();
  }
  ctx.restore();
}

// Sukuna Slashes rendering
function renderSlashes(w, h) {
  if (slashes.length === 0) return;

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  for (let i = slashes.length - 1; i >= 0; i--) {
    const s = slashes[i];
    s.life -= 0.045;
    if (s.life <= 0) {
      slashes.splice(i, 1);
      continue;
    }

    const half = s.len / 2;
    const cos = Math.cos(s.angle);
    const sin = Math.sin(s.angle);

    const x1 = s.x1 - cos * half;
    const y1 = s.y1 - sin * half;
    const x2 = s.x1 + cos * half;
    const y2 = s.y1 + sin * half;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width * s.life;
    ctx.shadowColor = '#ff4654';
    ctx.shadowBlur = 15;
    ctx.globalAlpha = s.life;
    ctx.stroke();
  }

  ctx.restore();
}

// Update HUD & Story Readouts
function updateReadout(progress, index) {
  const whole = Math.min(frameCount - 1, Math.round(index));
  const pct = Math.round(progress * 100);

  // Timeline Fill & Thumb
  fill.style.width = `${progress * 100}%`;
  thumb.style.left = `${progress * 100}%`;

  // Counters
  counter.textContent = `FRAME: ${String(whole + 1).padStart(2, '0')} / ${String(frameCount).padStart(2, '0')}`;
  percent.textContent = `${pct}%`;

  // Story Cards
  phase.textContent = `PHASE ${String(whole + 1).padStart(2, '0')} / ${String(frameCount).padStart(2, '0')}`;
  heading.textContent = stories[whole][0];
  body.textContent = stories[whole][1];

  // Tooltip
  tooltip.textContent = `PHASE ${String(whole + 1).padStart(2, '0')}: ${stories[whole][0]}`;
  tooltip.style.left = `${progress * 100}%`;

  // Domain Balance Gauges
  const balance = phaseBalance[whole] || [50, 50];
  balanceVoid.style.width = `${balance[0]}%`;
  balanceShrine.style.width = `${balance[1]}%`;
  targetLabel.textContent = `GOJO ${balance[0]}% ✕ SUKUNA ${balance[1]}%`;

  // Cursed Energy Telemetry Output
  const baseEnergy = 120 + Math.round(progress * 280);
  const velBoost = Math.round(velocity * 400);
  const totalEnergy = Math.min(500, baseEnergy + velBoost);

  if (totalEnergy >= 400) {
    energy.textContent = `${totalEnergy}% BLACK FLASH`;
    energy.classList.add('black-flash');
    subLabel.textContent = 'SPATIAL DISTORTION CRITICAL';
  } else if (totalEnergy >= 250) {
    energy.textContent = `${totalEnergy}% OVERLOAD`;
    energy.classList.remove('black-flash');
    subLabel.textContent = 'DOMAIN EXPANSION EXPANDING';
  } else {
    energy.textContent = `${totalEnergy}% MAX`;
    energy.classList.remove('black-flash');
    subLabel.textContent = 'NORMALIZED FLOW';
  }

  // Audio frequency reactivity
  if (isAudioActive && audioCtx && droneOsc) {
    const targetFreq = 48 + progress * 42 + Math.min(30, velocity * 60);
    droneOsc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.1);
  }
}

// Animation Loop (Damped Physics)
function tick() {
  // Handle Auto-Play Mode
  if (autoPlay && !userScrubbing) {
    const delta = (0.015 * playSpeed);
    target = Math.min(frameCount - 1, target + delta);
    if (target >= frameCount - 1) {
      target = 0; // Loop or end
    }
    // Synchronize actual page scroll position with auto-player
    const travel = Math.max(1, scene.offsetHeight - window.innerHeight);
    const scrollTarget = scene.offsetTop + (target / (frameCount - 1)) * travel;
    window.scrollTo({ top: scrollTarget, behavior: 'instant' });
  }

  // Smooth Interpolation
  current += (target - current) * 0.18;
  if (Math.abs(target - current) < 0.0005) {
    current = target;
  }

  // Calculate velocity for VFX
  velocity = Math.abs(current - prevCurrent);
  prevCurrent = current;

  // Randomly trigger slash during rapid scroll or high-energy phases
  if ((velocity > 0.06 || (current >= 5 && current <= 8 && Math.random() > 0.95)) && Math.random() > 0.75) {
    triggerSlash(1 + velocity * 2);
  }

  draw(current);

  const progress = target / (frameCount - 1);
  const whole = Math.round(current);
  if (whole !== lastProgress || velocity > 0.01) {
    updateReadout(progress, current);
    lastProgress = whole;
  }

  requestAnimationFrame(tick);
}

// Read Scroll Position
function readScroll() {
  if (userScrubbing || autoPlay) return;
  const rect = scene.getBoundingClientRect();
  const travel = Math.max(1, scene.offsetHeight - window.innerHeight);
  const progress = Math.max(0, Math.min(1, -rect.top / travel));
  target = progress * (frameCount - 1);
}

// Timeline Scrubber Seeking Logic
function handleScrubber(e) {
  const rect = timelineBar.getBoundingClientRect();
  const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
  const progress = clickX / rect.width;

  target = progress * (frameCount - 1);

  // Sync scroll position
  const travel = Math.max(1, scene.offsetHeight - window.innerHeight);
  const scrollTarget = scene.offsetTop + progress * travel;
  window.scrollTo({ top: scrollTarget, behavior: 'auto' });
}

timelineBar.addEventListener('mousedown', (e) => {
  userScrubbing = true;
  handleScrubber(e);
  const onMouseMove = (ev) => handleScrubber(ev);
  const onMouseUp = () => {
    userScrubbing = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
});

timelineBar.addEventListener('mousemove', (e) => {
  const rect = timelineBar.getBoundingClientRect();
  const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
  const progress = clickX / rect.width;
  const hoverIndex = Math.min(frameCount - 1, Math.round(progress * (frameCount - 1)));
  tooltip.textContent = `PHASE ${String(hoverIndex + 1).padStart(2, '0')}: ${stories[hoverIndex][0]}`;
  tooltip.style.left = `${progress * 100}%`;
});

// Touch scrubber
timelineBar.addEventListener('touchstart', (e) => {
  userScrubbing = true;
  if (e.touches[0]) handleScrubber(e.touches[0]);
}, { passive: true });

timelineBar.addEventListener('touchmove', (e) => {
  if (e.touches[0]) handleScrubber(e.touches[0]);
}, { passive: true });

timelineBar.addEventListener('touchend', () => {
  userScrubbing = false;
});

// Auto-Play Toggle
function toggleAutoPlay() {
  autoPlay = !autoPlay;
  if (autoPlay) {
    playBtn.classList.add('active');
    playBtn.querySelector('.ctrl-icon').textContent = '⏸';
    playBtn.querySelector('.ctrl-label').textContent = 'PAUSE';

    // If at end, loop to beginning
    if (target >= frameCount - 1.2) {
      target = 0;
    }

    // Scroll scene into view if hero is currently in view
    if (window.scrollY < scene.offsetTop - 100) {
      scene.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    playBtn.classList.remove('active');
    playBtn.querySelector('.ctrl-icon').textContent = '▶';
    playBtn.querySelector('.ctrl-label').textContent = 'AUTO';
  }
}

playBtn.addEventListener('click', toggleAutoPlay);

// Speed Cycling (0.5x, 1x, 2x)
speedBtn.addEventListener('click', () => {
  if (playSpeed === 1.0) {
    playSpeed = 2.0;
    speedBtn.textContent = '2.0×';
  } else if (playSpeed === 2.0) {
    playSpeed = 0.5;
    speedBtn.textContent = '0.5×';
  } else {
    playSpeed = 1.0;
    speedBtn.textContent = '1.0×';
  }
});

// Hero Watch Button
heroPlayBtn.addEventListener('click', () => {
  scene.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    if (!autoPlay) toggleAutoPlay();
    if (!isAudioActive) initAudio();
  }, 400);
});

// Replay button
replayBtn.addEventListener('click', () => {
  target = 0;
  hero.scrollIntoView({ behavior: 'smooth' });
  if (autoPlay) toggleAutoPlay();
});

// Keyboard Navigation
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    toggleAutoPlay();
  } else if (e.code === 'ArrowDown' || e.code === 'ArrowRight') {
    e.preventDefault();
    target = Math.min(frameCount - 1, target + 1);
  } else if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') {
    e.preventDefault();
    target = Math.max(0, target - 1);
  } else if (e.code === 'KeyM') {
    e.preventDefault();
    toggleAudio();
  }
});

// Web Audio Jujutsu Ambience Synthesizer
function initAudio() {
  if (audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);

  // Sub Drone Oscillator (54Hz fundamental)
  droneOsc = audioCtx.createOscillator();
  droneOsc.type = 'sine';
  droneOsc.frequency.setValueAtTime(54, audioCtx.currentTime);

  const droneFilter = audioCtx.createBiquadFilter();
  droneFilter.type = 'lowpass';
  droneFilter.frequency.setValueAtTime(160, audioCtx.currentTime);

  droneOsc.connect(droneFilter);
  droneFilter.connect(masterGain);
  droneOsc.start();

  // Harmonic High Overtone (Pulsing energy ring)
  harmOsc = audioCtx.createOscillator();
  harmOsc.type = 'triangle';
  harmOsc.frequency.setValueAtTime(108, audioCtx.currentTime);

  const harmGain = audioCtx.createGain();
  harmGain.gain.setValueAtTime(0.015, audioCtx.currentTime);

  harmOsc.connect(harmGain);
  harmGain.connect(masterGain);
  harmOsc.start();

  isAudioActive = true;
  soundBtn.classList.add('sound-on');
  soundBtn.querySelector('.sound-icon').textContent = '🔊';
  soundBtn.querySelector('.sound-label').textContent = 'SOUND: ON';
}

function playSlashAudio() {
  if (!audioCtx || !isAudioActive) return;
  const bufferSize = audioCtx.sampleRate * 0.12;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1400 + Math.random() * 600, audioCtx.currentTime);
  filter.Q.setValueAtTime(5, audioCtx.currentTime);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.11);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  noise.start();
}

function toggleAudio() {
  if (!audioCtx) {
    initAudio();
  } else if (audioCtx.state === 'running') {
    audioCtx.suspend();
    isAudioActive = false;
    soundBtn.classList.remove('sound-on');
    soundBtn.querySelector('.sound-icon').textContent = '🔈';
    soundBtn.querySelector('.sound-label').textContent = 'SOUND: OFF';
  } else {
    audioCtx.resume();
    isAudioActive = true;
    soundBtn.classList.add('sound-on');
    soundBtn.querySelector('.sound-icon').textContent = '🔊';
    soundBtn.querySelector('.sound-label').textContent = 'SOUND: ON';
  }
}

soundBtn.addEventListener('click', toggleAudio);

// Window Listeners
window.addEventListener('scroll', readScroll, { passive: true });
window.addEventListener('resize', resize);

// Preload Listener
images.forEach((img, i) => {
  img.addEventListener('load', () => {
    if (i === 0) draw(0);
  });
});

// Initialization
resize();
readScroll();
tick();
