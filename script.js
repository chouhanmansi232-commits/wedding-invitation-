// Himanshi & Anshul Wedding Invitation Script

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    });
  }

  initEnvelope();
  initCountdown();
  initPetalsCanvas();
  initAudioSystem();
  initSwiper();
  initLightbox();
  initRSVP();
  initGuestbook();
  initCalendarAndShare();
});

/* ==========================================================================
   1. Envelope / Royal Gate Opening
   ========================================================================== */
function initEnvelope() {
  const envelopeModal = document.getElementById('envelope-modal');
  const openInviteBtn = document.getElementById('open-invite-btn');
  const waxSeal = document.getElementById('wax-seal');

  function openCard() {
    if (!envelopeModal) return;

    // Trigger celebration confetti
    triggerConfetti();

    // Start background music
    startAudio();

    // Animate envelope exit
    envelopeModal.style.transform = 'translateY(-100%) scale(0.95)';
    envelopeModal.style.opacity = '0';
    setTimeout(() => {
      envelopeModal.style.display = 'none';
      document.body.style.overflow = 'auto';
      // Refresh AOS positions
      if (typeof AOS !== 'undefined') AOS.refresh();
    }, 800);
  }

  if (openInviteBtn) openInviteBtn.addEventListener('click', openCard);
  if (waxSeal) waxSeal.addEventListener('click', openCard);
}

/* ==========================================================================
   2. Live Wedding Countdown (Target: Nov 24, 2026)
   ========================================================================== */
function initCountdown() {
  const weddingDate = new Date('November 24, 2026 18:00:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  function update() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minutesEl) minutesEl.innerText = '00';
      if (secondsEl) secondsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. Floating Rose Petals & Golden Sparkles Canvas
   ========================================================================== */
function initPetalsCanvas() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = window.innerWidth < 768 ? 20 : 35;
  const petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 12 + 10;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 1.5 - 0.75;
      this.angle = Math.random() * 360;
      this.spinSpeed = (Math.random() - 0.5) * 1.5;
      this.opacity = Math.random() * 0.5 + 0.35;
      this.isGold = Math.random() < 0.25; // 25% golden flakes, 75% rose petals
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin((this.y * Math.PI) / 180) * 0.8 + this.speedX;
      this.angle += this.spinSpeed;

      if (this.y > height + 20 || this.x > width + 20 || this.x < -20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.isGold) {
        // Golden sparkle
        ctx.fillStyle = '#fce588';
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Delicate Rose petal shape
        ctx.fillStyle = '#b72445';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
        ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
        ctx.fill();

        // Shading inside petal
        ctx.fillStyle = 'rgba(255, 180, 195, 0.4)';
        ctx.beginPath();
        ctx.arc(0, this.size * 0.4, this.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < petalsCount; i++) {
    petals.push(new Petal());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   4. Background Music System (Audio & Procedural WebAudio Fallback)
   ========================================================================== */
let isAudioPlaying = false;
let audioContext = null;
let synthTimer = null;
const audioPlayer = new Audio();
// Reliable royalty-free peaceful Indian wedding flute / ambient sitar track
audioPlayer.src = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=indian-meditation-flute-112194.mp3';
audioPlayer.loop = true;
audioPlayer.volume = 0.5;

function initAudioSystem() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');

  if (audioBtn) {
    audioBtn.addEventListener('click', toggleAudio);
  }
}

function startAudio() {
  if (isAudioPlaying) return;

  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');

  audioPlayer
    .play()
    .then(() => {
      isAudioPlaying = true;
      if (audioBtn) audioBtn.classList.add('playing');
      if (audioIcon) {
        audioIcon.classList.remove('fa-volume-xmark');
        audioIcon.classList.add('fa-music');
      }
    })
    .catch(() => {
      // If external audio is blocked or fails, use Web Audio API romantic melodic bells/chords
      startWebAudioSynthesizer();
    });
}

function toggleAudio() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');

  if (isAudioPlaying) {
    audioPlayer.pause();
    if (synthTimer) clearInterval(synthTimer);
    isAudioPlaying = false;
    if (audioBtn) audioBtn.classList.remove('playing');
    if (audioIcon) {
      audioIcon.classList.remove('fa-music');
      audioIcon.classList.add('fa-volume-xmark');
    }
  } else {
    audioPlayer
      .play()
      .then(() => {
        isAudioPlaying = true;
        if (audioBtn) audioBtn.classList.add('playing');
        if (audioIcon) {
          audioIcon.classList.remove('fa-volume-xmark');
          audioIcon.classList.add('fa-music');
        }
      })
      .catch(() => {
        startWebAudioSynthesizer();
      });
  }
}

// Procedural soothing Tanpura/Bells synth for romantic wedding vibe
function startWebAudioSynthesizer() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioContext) audioContext = new AudioCtx();
    if (audioContext.state === 'suspended') audioContext.resume();

    const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // C Major Pentatonic (peaceful & joyful)
    let noteIdx = 0;

    function playChime(freq) {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);

      gain.gain.setValueAtTime(0.001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 2.6);
    }

    if (synthTimer) clearInterval(synthTimer);
    synthTimer = setInterval(() => {
      const currentNote = notes[noteIdx % notes.length];
      playChime(currentNote);
      if (Math.random() > 0.4) {
        setTimeout(() => playChime(notes[(noteIdx + 2) % notes.length]), 250);
      }
      noteIdx++;
    }, 1800);

    isAudioPlaying = true;
    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioIcon = document.getElementById('audio-icon');
    if (audioBtn) audioBtn.classList.add('playing');
    if (audioIcon) {
      audioIcon.classList.remove('fa-volume-xmark');
      audioIcon.classList.add('fa-music');
    }
  } catch (e) {
    console.warn('WebAudio fallback error:', e);
  }
}

/* ==========================================================================
   5. Swiper.js Slider Initialization
   ========================================================================== */
function initSwiper() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.wedding-swiper', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    centeredSlides: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 1.5,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 2.2,
        spaceBetween: 32,
      },
    },
  });
}

/* ==========================================================================
   6. Lightbox Photo Viewer
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  const triggers = document.querySelectorAll('[data-lightbox-src]');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-lightbox-src');
      const caption = trigger.getAttribute('data-lightbox-caption') || 'Himanshi & Anshul';

      if (lightbox && lightboxImg) {
        lightboxImg.src = src;
        if (lightboxCaption) lightboxCaption.innerText = caption;
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
      document.body.style.overflow = 'auto';
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });
  }

  // Escape key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* ==========================================================================
   7. Confetti Burst
   ========================================================================== */
function triggerConfetti() {
  if (typeof confetti === 'function') {
    // Royal gold & crimson petal celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#e2b755', '#a81c2f', '#f9c5d1', '#ffffff'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#d4af37', '#a81c2f', '#fce588'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#d4af37', '#a81c2f', '#fce588'],
      });
    }, 250);
  }
}

/* ==========================================================================
   8. RSVP Form Handling
   ========================================================================== */
function initRSVP() {
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccess = document.getElementById('rsvp-success-msg');

  if (!rsvpForm) return;

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('rsvp-name').value.trim();
    const guests = document.getElementById('rsvp-guests').value;
    const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Yes';
    const message = document.getElementById('rsvp-message').value.trim();

    if (!name) return;

    // Save to localStorage
    const savedRSVPs = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
    savedRSVPs.push({
      name,
      guests,
      attendance,
      message,
      date: new Date().toLocaleDateString(),
    });
    localStorage.setItem('wedding_rsvps', JSON.stringify(savedRSVPs));

    // Also add to guestbook if they left a message
    if (message) {
      saveGuestbookWish(name, message);
    }

    // Trigger celebration & success alert
    triggerConfetti();

    rsvpForm.reset();
    if (rsvpSuccess) {
      rsvpSuccess.classList.remove('hidden');
      setTimeout(() => {
        rsvpSuccess.classList.add('hidden');
      }, 6000);
    }
  });
}

/* ==========================================================================
   9. Guestbook Blessings Wall
   ========================================================================== */
function initGuestbook() {
  const guestbookList = document.getElementById('guestbook-list');
  const wishForm = document.getElementById('wish-form');

  // Initial demo wishes
  const defaultWishes = [
    {
      name: 'Rajesh & Sunita Sharma',
      relation: "Groom's Uncle & Aunt",
      message: 'Wishing Himanshi and Anshul a lifetime filled with boundless love, laughter, and prosperity! May your journey together be blessed.',
      date: 'Oct 3, 2026',
    },
    {
      name: 'Pooja & Vikram Malhotra',
      relation: "Bride's Family",
      message: 'Heartiest congratulations to our dearest Himanshi and handsome Anshul! Counting down the days to dance at the Sangeet!',
      date: 'Oct 4, 2026',
    },
    {
      name: 'Aman & Neha Verma',
      relation: 'College Besties',
      message: 'From college library stories to the royal mandap — you two are truly made for each other! Can not wait for 24 Nov 2026!',
      date: 'Oct 4, 2026',
    },
  ];

  function getStoredWishes() {
    const stored = localStorage.getItem('wedding_wishes');
    if (!stored) {
      localStorage.setItem('wedding_wishes', JSON.stringify(defaultWishes));
      return defaultWishes;
    }
    return JSON.parse(stored);
  }

  function renderWishes() {
    if (!guestbookList) return;
    const wishes = getStoredWishes();
    guestbookList.innerHTML = wishes
      .map(
        (w) => `
        <div class="p-6 rounded-2xl royal-glass border border-amber-500/20 shadow-lg relative group hover:border-amber-400/40 transition duration-300">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h4 class="font-cinzel font-bold text-amber-200 text-lg">${escapeHtml(w.name)}</h4>
              <p class="text-xs text-amber-300/70 italic">${escapeHtml(w.relation || 'Honored Guest')}</p>
            </div>
            <span class="text-xs text-amber-200/50">${escapeHtml(w.date || 'Recent')}</span>
          </div>
          <p class="text-stone-300 text-sm leading-relaxed italic">"${escapeHtml(w.message)}"</p>
          <div class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 text-xs">
            <i class="fa-solid fa-heart"></i>
          </div>
        </div>
      `
      )
      .join('');
  }

  window.saveGuestbookWish = function (name, message) {
    const wishes = getStoredWishes();
    wishes.unshift({
      name,
      relation: 'Beloved Guest',
      message,
      date: 'Just now',
    });
    localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
    renderWishes();
  };

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('wish-name');
      const msgInput = document.getElementById('wish-message');

      if (nameInput.value.trim() && msgInput.value.trim()) {
        window.saveGuestbookWish(nameInput.value.trim(), msgInput.value.trim());
        nameInput.value = '';
        msgInput.value = '';
        triggerConfetti();
      }
    });
  }

  renderWishes();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

/* ==========================================================================
   10. Calendar & WhatsApp Share Integration
   ========================================================================== */
function initCalendarAndShare() {
  const gcalBtn = document.getElementById('add-gcal-btn');
  const icalBtn = document.getElementById('download-ical-btn');
  const shareBtn = document.getElementById('whatsapp-share-btn');

  const title = encodeURIComponent('Himanshi & Anshul Wedding Ceremony');
  const details = encodeURIComponent(
    'Together with their families, Himanshi & Anshul invite you to celebrate their auspicious wedding ceremony in royal heritage style.'
  );
  const location = encodeURIComponent('The Royal Heritage Grand Palace & Resort, Jaipur, Rajasthan');

  // Nov 24, 2026, 18:00 to 23:59 IST (UTC+5:30 -> 12:30 UTC)
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261124T123000Z/20261124T183000Z&details=${details}&location=${location}`;

  if (gcalBtn) {
    gcalBtn.href = gcalUrl;
  }

  if (icalBtn) {
    icalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Himanshi and Anshul Wedding//EN',
        'BEGIN:VEVENT',
        'UID:wedding-himanshi-anshul-2026@invitation',
        'DTSTAMP:20261004T120000Z',
        'DTSTART:20261124T123000Z',
        'DTEND:20261124T183000Z',
        'SUMMARY:Himanshi & Anshul Wedding Ceremony',
        'DESCRIPTION:Join us to celebrate the royal wedding of Himanshi and Anshul on 24 November 2026.',
        'LOCATION:The Royal Heritage Grand Palace & Resort, Jaipur',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Himanshi_Anshul_Wedding_Nov24_2026.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  if (shareBtn) {
    const shareText = encodeURIComponent(
      `✨ You're Cordially Invited! ✨\n\nHimanshi & Anshul are getting married on 24 November 2026!\n\nPlease join us in celebrating our auspicious union. View our interactive digital wedding invitation card here:\n${window.location.href}`
    );
    shareBtn.href = `https://api.whatsapp.com/send?text=${shareText}`;
  }
}
