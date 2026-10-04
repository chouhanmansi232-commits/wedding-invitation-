/**
 * ANSHUL & HIMANSHI • LUXURY EDITORIAL WEDDING INVITATION
 * Interaction & Animation Engine
 * - Smooth IntersectionObserver reveal
 * - Soft canvas floating jasmine petals & gold dust
 * - Soft subtle parallax depth
 * - Luxury ambient flute audio player with WebAudio fallback
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initAmbientCanvas();
  initSubtleParallax();
  initAudioSystem();
});

/* ==========================================================================
   1. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-item');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12,
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

  // Keep particle count low (14 max) for minimalist luxury elegance
  const particleCount = window.innerWidth < 640 ? 8 : 14;
  const particles = [];

  class AmbientParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = Math.random() * 8 + 6; // Delicate size
      this.speedY = Math.random() * 0.45 + 0.25; // Very slow drift
      this.speedX = Math.random() * 0.35 - 0.15;
      this.angle = Math.random() * 360;
      this.spinSpeed = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.35 + 0.15;
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
        // Delicate ivory jasmine petal with soft warm cream tone
        ctx.fillStyle = '#FAF5EE';
        ctx.strokeStyle = 'rgba(212, 185, 140, 0.4)';
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size * 0.4, -this.size * 0.4, -this.size * 0.7, this.size * 0.4, 0, this.size);
        ctx.bezierCurveTo(this.size * 0.7, this.size * 0.4, this.size * 0.4, -this.size * 0.4, 0, 0);
        ctx.fill();
        ctx.stroke();

        // Soft center vein
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
   3. SUBTLE PARALLAX DEPTH ON PHOTOGRAPHS
   Smooth, gentle micro-movement
   ========================================================================== */
function initSubtleParallax() {
  const heroImg = document.querySelector('.hero-couple-img');
  const editorialImg = document.querySelector('.editorial-couple-img');

  if (!heroImg && !editorialImg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;

        if (heroImg) {
          const heroOffset = scrollY * 0.04;
          heroImg.style.transform = `translateY(${heroOffset}px) scale(1.02)`;
        }

        if (editorialImg) {
          const rect = editorialImg.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            const editorialOffset = (rect.top - window.innerHeight * 0.5) * 0.035;
            editorialImg.style.transform = `translateY(${editorialOffset}px) scale(1.01)`;
          }
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   4. LUXURY AMBIENT AUDIO SYSTEM
   Serene wedding flute with WebAudio synthesizer harmonic fallback
   ========================================================================== */
function initAudioSystem() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioLabel = document.getElementById('audio-label');
  if (!audioBtn) return;

  let isPlaying = false;
  let audioContext = null;
  let synthInterval = null;

  const audioPlayer = new Audio();
  // Peaceful, serene Indian wedding flute ambient melody
  audioPlayer.src = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=indian-meditation-flute-112194.mp3';
  audioPlayer.loop = true;
  audioPlayer.volume = 0.5;

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

        // Gentle envelope
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
      console.warn('Procedural audio fallback notice:', e);
    }
  }

  function startAudio() {
    isPlaying = true;
    audioBtn.classList.add('audio-playing');
    if (audioLabel) audioLabel.textContent = 'Playing';

    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback to procedural calm ambient harmony if blocked by browser policy
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

  // Optional subtle one-time interaction prompt: first gentle tap starts serene audio if user desires
  const autoStartOnFirstTap = () => {
    // Only start if user interacts with the page once
    window.removeEventListener('click', autoStartOnFirstTap);
    // Don't force auto-play unless user tapped the audio button directly
  };
}
