/**
 * HIMANSHI & ANSHUL • LUXURY EDITORIAL WEDDING INVITATION
 * Interactive Animation Engine
 * 1. 3D Interactive Opening Envelope & Wax Seal
 * 2. Delicate Floating Jasmine Petals & Golden Stardust Canvas
 * 3. Smooth IntersectionObserver Scroll Reveal
 * 4. Micro-Parallax Photography Depth
 * 5. Serene Ambient Wedding Flute Audio with Procedural Harmonic Fallback
 */

document.addEventListener('DOMContentLoaded', () => {
  initEnvelopeAnimation();
  initAmbientCanvas();
  initScrollReveal();
  initSubtleParallax();
  initAudioSystem();
});

/* ==========================================================================
   1. 3D INTERACTIVE WEDDING INVITATION ENVELOPE
   ========================================================================== */
function initEnvelopeAnimation() {
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const envelopeCardBox = document.getElementById('envelope-card-box');
  const cardEnterBtn = document.getElementById('card-enter-btn');
  const skipEnvelopeBtn = document.getElementById('skip-envelope-btn');
  const reopenEnvelopeBtn = document.getElementById('reopen-envelope-btn');
  const envelopeCue = document.getElementById('envelope-action-cue');

  if (!envelopeOverlay || !envelopeCardBox) return;

  let isEnvelopeOpen = false;

  // Open Envelope on click / tap
  function openEnvelope() {
    if (isEnvelopeOpen) return;
    isEnvelopeOpen = true;

    envelopeCardBox.classList.add('envelope-opened');
    if (envelopeCue) {
      envelopeCue.style.opacity = '0';
    }

    // Try to trigger subtle ambient music on opening interaction
    tryStartAudioOnInteraction();
  }

  // Dismiss Envelope Overlay and enter invitation
  function dismissEnvelope() {
    envelopeOverlay.classList.add('envelope-dismissed');
    document.body.style.overflow = 'auto';

    // Trigger hero reveal
    setTimeout(() => {
      const heroItems = document.querySelectorAll('#hero .reveal-item');
      heroItems.forEach((el) => el.classList.add('revealed'));
    }, 200);
  }

  // Re-open Envelope from top bar
  function resetAndReopenEnvelope() {
    isEnvelopeOpen = false;
    envelopeCardBox.classList.remove('envelope-opened');
    if (envelopeCue) {
      envelopeCue.style.opacity = '1';
    }
    envelopeOverlay.classList.remove('envelope-dismissed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  envelopeCardBox.addEventListener('click', (e) => {
    // If card step inside button was clicked, dismiss directly
    if (e.target.closest('#card-enter-btn')) {
      e.stopPropagation();
      dismissEnvelope();
      return;
    }
    openEnvelope();
  });

  envelopeCardBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isEnvelopeOpen) {
        openEnvelope();
      } else {
        dismissEnvelope();
      }
    }
  });

  if (cardEnterBtn) {
    cardEnterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissEnvelope();
    });
  }

  if (skipEnvelopeBtn) {
    skipEnvelopeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissEnvelope();
    });
  }

  if (reopenEnvelopeBtn) {
    reopenEnvelopeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetAndReopenEnvelope();
    });
  }
}

/* ==========================================================================
   2. AMBIENT JASMINE PETALS & GOLD DUST CANVAS
   Delicate, whisper-soft, luxury aesthetic
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Balanced particle count for luxury serenity
  const particleCount = window.innerWidth < 640 ? 10 : 16;
  const particles = [];

  class AmbientParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = Math.random() * 8 + 6; // Delicate size
      this.speedY = Math.random() * 0.45 + 0.25; // Gentle float
      this.speedX = Math.random() * 0.3 - 0.15;
      this.angle = Math.random() * 360;
      this.spinSpeed = (Math.random() - 0.5) * 0.7;
      this.opacity = Math.random() * 0.35 + 0.18;
      this.isGoldDust = Math.random() > 0.65;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin((this.y * Math.PI) / 240) * 0.4 + this.speedX;
      this.angle += this.spinSpeed;

      if (this.y > height + 40 || this.x > width + 40 || this.x < -40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.isGoldDust) {
        // Soft golden stardust shimmer
        ctx.fillStyle = '#DFBE82';
        ctx.shadowColor = '#C5A880';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Delicate ivory jasmine petal
        ctx.fillStyle = '#FAF6F0';
        ctx.strokeStyle = 'rgba(212, 185, 140, 0.4)';
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size * 0.4, -this.size * 0.4, -this.size * 0.7, this.size * 0.4, 0, this.size);
        ctx.bezierCurveTo(this.size * 0.7, this.size * 0.4, this.size * 0.4, -this.size * 0.4, 0, 0);
        ctx.fill();
        ctx.stroke();

        // Soft center petal vein
        ctx.beginPath();
        ctx.moveTo(0, this.size * 0.15);
        ctx.lineTo(0, this.size * 0.85);
        ctx.strokeStyle = 'rgba(197, 168, 128, 0.3)';
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new AmbientParticle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   3. SCROLL REVEAL (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-item');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   4. SUBTLE PARALLAX DEPTH ON PHOTOGRAPHS
   ========================================================================== */
function initSubtleParallax() {
  const parallaxImages = document.querySelectorAll('.parallax-img');
  if (!parallaxImages.length) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const windowHeight = window.innerHeight;

        parallaxImages.forEach((img) => {
          const rect = img.getBoundingClientRect();
          if (rect.top < windowHeight && rect.bottom > 0) {
            const offset = (rect.top - windowHeight * 0.5) * 0.035;
            img.style.transform = `translateY(${offset}px) scale(1.02)`;
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   5. LUXURY AMBIENT FLUTE AUDIO SYSTEM
   Serene wedding flute with WebAudio synthesizer harmonic fallback
   ========================================================================== */
let audioSystemInstance = null;

function initAudioSystem() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioLabel = document.getElementById('audio-label');
  if (!audioBtn) return;

  let isPlaying = false;
  let audioContext = null;
  let synthInterval = null;

  const audioPlayer = new Audio();
  // Serene Indian wedding flute ambient melody
  audioPlayer.src = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=indian-meditation-flute-112194.mp3';
  audioPlayer.loop = true;
  audioPlayer.volume = 0.45;

  function playSynthAmbience() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContext) audioContext = new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();

      // Pentatonic Raag Yaman warm harmony frequencies (D-F#-A-C#-E)
      const scale = [293.66, 369.99, 440.0, 554.37, 587.33, 659.25, 739.99];

      function triggerFluteTone() {
        if (!isPlaying || !audioContext) return;
        const note = scale[Math.floor(Math.random() * scale.length)];
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, audioContext.currentTime);

        gain.gain.setValueAtTime(0.001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 3.8);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start();
        osc.stop(audioContext.currentTime + 4.0);
      }

      triggerFluteTone();
      synthInterval = setInterval(triggerFluteTone, 3200);
    } catch (e) {
      console.warn('Procedural audio notice:', e);
    }
  }

  function startAudio() {
    isPlaying = true;
    audioBtn.classList.add('audio-playing');
    if (audioLabel) audioLabel.textContent = 'Playing';

    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        playSynthAmbience();
      });
    }
  }

  function pauseAudio() {
    isPlaying = false;
    audioBtn.classList.remove('audio-playing');
    if (audioLabel) audioLabel.textContent = 'Music';

    audioPlayer.pause();
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  audioBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isPlaying) {
      pauseAudio();
    } else {
      startAudio();
    }
  });

  audioSystemInstance = {
    start: startAudio,
    isPlaying: () => isPlaying
  };
}

function tryStartAudioOnInteraction() {
  if (audioSystemInstance && !audioSystemInstance.isPlaying()) {
    audioSystemInstance.start();
  }
}
