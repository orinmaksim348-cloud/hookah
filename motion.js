/**
 * ============================================================================
 * HOOKAH LOUNGE SHAKHTY — TASTE-SKILL & MOTION DESIGN ENGINE
 * ============================================================================
 */

(function () {
  'use strict';

  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* --------------------------------------------------------------------------
   * 2. INTERACTIVE EMBER & SMOKE CANVAS SIMULATION
   * -------------------------------------------------------------------------- */
  const canvas = document.getElementById('smoke-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = window.innerWidth < 768 ? 20 : 38;

    let mouse = {
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      lastX: width / 2,
      lastY: height / 2,
      isActive: false
    };

    window.addEventListener('mousemove', (e) => {
      mouse.vx = e.clientX - mouse.lastX;
      mouse.vy = e.clientY - mouse.lastY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.lastX = e.clientX;
      mouse.lastY = e.clientY;
      mouse.isActive = true;

      // Spawn subtle particle puff on cursor velocity
      if (Math.hypot(mouse.vx, mouse.vy) > 4 && particles.length < maxParticles + 10) {
        particles.push(new Particle(mouse.x, mouse.y, true));
      }
    });

    class Particle {
      constructor(x, y, fromCursor = false) {
        this.reset(x, y, fromCursor);
      }

      reset(x, y, fromCursor = false) {
        this.isEmber = Math.random() > 0.75;
        this.x = x !== undefined ? x : Math.random() * width;
        this.y = y !== undefined ? y : height + Math.random() * 60;

        if (this.isEmber) {
          this.radius = Math.random() * 2 + 1;
          this.maxRadius = this.radius * 1.4;
          this.vx = (Math.random() - 0.5) * 1.1;
          this.vy = -(Math.random() * 1.2 + 0.6);
          this.alpha = fromCursor ? 0.7 : 0.05;
          this.maxAlpha = Math.random() * 0.55 + 0.3;
          this.growth = 0;
          this.decay = Math.random() * 0.004 + 0.002;
          this.color = Math.random() > 0.5 ? '226, 114, 56' : '245, 158, 11';
        } else {
          this.radius = fromCursor ? Math.random() * 25 + 15 : Math.random() * 55 + 30;
          this.maxRadius = this.radius * 2.5;
          this.vx = (Math.random() - 0.5) * 0.6;
          this.vy = -(Math.random() * 0.6 + 0.3);
          this.alpha = fromCursor ? 0.16 : 0.01;
          this.maxAlpha = Math.random() * 0.12 + 0.04;
          this.growth = Math.random() * 0.2 + 0.1;
          this.decay = Math.random() * 0.0015 + 0.001;
          this.color = '28, 33, 44';
        }

        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.01;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.spin;
        this.vx += (Math.random() - 0.5) * 0.03;

        if (this.radius < this.maxRadius) {
          this.radius += this.growth;
        }

        if (this.alpha < this.maxAlpha) {
          this.alpha += 0.004;
        } else {
          this.alpha -= this.decay;
        }

        if (this.alpha <= 0 || this.y < -this.radius || this.x < -this.radius || this.x > width + this.radius) {
          this.reset();
        }
      }

      draw(context) {
        context.save();
        context.translate(this.x, this.y);

        if (this.isEmber) {
          context.fillStyle = `rgba(${this.color}, ${this.alpha})`;
          context.shadowColor = `rgba(${this.color}, 0.7)`;
          context.shadowBlur = 6;
          context.beginPath();
          context.arc(0, 0, this.radius, 0, Math.PI * 2);
          context.fill();
        } else {
          context.rotate(this.angle);
          const grad = context.createRadialGradient(0, 0, this.radius * 0.1, 0, 0, this.radius);
          grad.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
          grad.addColorStop(0.5, `rgba(${this.color}, ${this.alpha * 0.5})`);
          grad.addColorStop(1, `rgba(${this.color}, 0)`);
          context.fillStyle = grad;
          context.beginPath();
          context.arc(0, 0, this.radius, 0, Math.PI * 2);
          context.fill();
        }

        context.restore();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }
      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }

  /* --------------------------------------------------------------------------
   * 3. CARD SPOTLIGHT & PERSPECTIVE TILT
   * -------------------------------------------------------------------------- */
  const cards = document.querySelectorAll('.card, .tilt-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (card.classList.contains('tilt-card')) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4.5;
        const rotateY = ((x - centerX) / centerX) * 4.5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (card.classList.contains('tilt-card')) {
        card.style.transform = '';
      }
    });
  });

  /* --------------------------------------------------------------------------
   * 4. SCROLL REVEAL & STATS COUNTER ANIMATION
   * -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // Number Counter Animation
  const counterEls = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach((el) => counterObserver.observe(el));

  function animateCounter(el) {
    const rawVal = el.getAttribute('data-counter');
    const target = parseFloat(rawVal);
    const isFloat = rawVal.includes('.');
    const suffix = el.textContent.includes('★') ? ' ★' : '';
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = start + (target - start) * (1 - (1 - progress) * (1 - progress));
      el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = rawVal + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  /* --------------------------------------------------------------------------
   * 5. ATMOSPHERE & ZONES SWITCHER
   * -------------------------------------------------------------------------- */
  const featureRows = document.querySelectorAll('.feature-row');
  const featureImg = document.getElementById('feature-img');
  const featureBadge = document.getElementById('feature-badge');

  featureRows.forEach((row) => {
    row.addEventListener('click', () => {
      featureRows.forEach((r) => r.classList.remove('active'));
      row.classList.add('active');

      const newSrc = row.getAttribute('data-feature-img');
      const newBadge = row.getAttribute('data-feature-badge');

      if (featureImg && newSrc) {
        featureImg.style.opacity = '0';
        featureImg.style.transform = 'scale(0.97)';
        setTimeout(() => {
          featureImg.src = newSrc;
          featureImg.style.opacity = '1';
          featureImg.style.transform = 'scale(1)';
        }, 180);
      }

      if (featureBadge && newBadge) {
        featureBadge.textContent = newBadge;
      }
    });
  });

  /* --------------------------------------------------------------------------
   * 6. REAL-TIME WORKING HOURS & LIVE STATUS (Shakhty, MSK UTC+3)
   * -------------------------------------------------------------------------- */
  function updateScheduleStatus() {
    const headerStatusText = document.getElementById('header-status-text');
    const headerStatusDot = document.getElementById('header-status-dot');
    const drawerStatusTitle = document.getElementById('drawer-status-title');
    const drawerLiveDot = document.getElementById('drawer-live-dot');
    const drawerStatusSub = document.getElementById('drawer-status-sub');
    const scheduleRows = document.querySelectorAll('.schedule-row');

    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Moscow',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      weekday: 'short'
    });

    const parts = formatter.formatToParts(now);
    let hour = 0, minute = 0, weekdayStr = '';
    parts.forEach(p => {
      if (p.type === 'hour') hour = parseInt(p.value, 10);
      if (p.type === 'minute') minute = parseInt(p.value, 10);
      if (p.type === 'weekday') weekdayStr = p.value.toLowerCase();
    });

    const currentMinutes = hour * 60 + minute;
    const dayMap = { 'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6 };
    const dayIndex = dayMap[weekdayStr] !== undefined ? dayMap[weekdayStr] : now.getDay();

    scheduleRows.forEach(row => {
      if (parseInt(row.getAttribute('data-day'), 10) === dayIndex) {
        row.classList.add('is-today');
      } else {
        row.classList.remove('is-today');
      }
    });

    let isOpen = false;
    let closingTime = '03:30';

    if (currentMinutes >= 18 * 60) {
      isOpen = true;
      closingTime = (dayIndex === 5 || dayIndex === 6) ? '04:30' : '03:30';
    } else {
      const prevDayIndex = (dayIndex + 6) % 7;
      const prevDayMaxMin = (prevDayIndex === 5 || prevDayIndex === 6) ? (4 * 60 + 30) : (3 * 60 + 30);
      if (currentMinutes < prevDayMaxMin) {
        isOpen = true;
        closingTime = (prevDayIndex === 5 || prevDayIndex === 6) ? '04:30' : '03:30';
      }
    }

    if (isOpen) {
      if (headerStatusText) headerStatusText.textContent = `Открыто · до ${closingTime}`;
      if (headerStatusDot) headerStatusDot.style.background = '#10b981';
      if (drawerStatusTitle) drawerStatusTitle.innerHTML = `<span style="color:#10b981;">Сейчас открыто</span> (до ${closingTime})`;
      if (drawerLiveDot) drawerLiveDot.style.background = '#10b981';
    } else {
      if (headerStatusText) headerStatusText.textContent = `Закрыто · до 18:00`;
      if (headerStatusDot) headerStatusDot.style.background = '#f59e0b';
      if (drawerStatusTitle) drawerStatusTitle.innerHTML = `<span style="color:#f59e0b;">Сейчас закрыто</span> (откроется в 18:00)`;
      if (drawerLiveDot) drawerLiveDot.style.background = '#f59e0b';
    }
  }

  updateScheduleStatus();
  setInterval(updateScheduleStatus, 60000);

  /* --------------------------------------------------------------------------
   * 7. SIDE INFO DRAWER (Боковое меню со всей информацией)
   * -------------------------------------------------------------------------- */
  const infoDrawer = document.getElementById('info-drawer');
  const openInfoDrawerBtn = document.getElementById('open-info-drawer');
  const closeInfoDrawerBtn = document.getElementById('close-info-drawer');
  const infoDrawerOverlay = document.getElementById('info-drawer-overlay');
  const drawerBookTrigger = document.getElementById('drawer-book-trigger');

  function openDrawer() {
    if (!infoDrawer) return;
    infoDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!infoDrawer) return;
    infoDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openInfoDrawerBtn) openInfoDrawerBtn.addEventListener('click', openDrawer);
  if (closeInfoDrawerBtn) closeInfoDrawerBtn.addEventListener('click', closeDrawer);
  if (infoDrawerOverlay) infoDrawerOverlay.addEventListener('click', closeDrawer);

  if (drawerBookTrigger) {
    drawerBookTrigger.addEventListener('click', () => {
      closeDrawer();
      setTimeout(openBookingModal, 250);
    });
  }

  /* --------------------------------------------------------------------------
   * 8. FAQ ACCORDION
   * -------------------------------------------------------------------------- */
  const faqCards = document.querySelectorAll('.faq-card');
  faqCards.forEach((card) => {
    const head = card.querySelector('.faq-head');
    const body = card.querySelector('.faq-body');

    head.addEventListener('click', () => {
      const isOpen = card.classList.contains('is-open');

      faqCards.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-head').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-body').style.maxHeight = null;
      });

      if (!isOpen) {
        card.classList.add('is-open');
        head.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 30 + 'px';
      }
    });
  });

  /* --------------------------------------------------------------------------
   * 9. PHOTO CHAPTERS & LIGHTBOX
   * -------------------------------------------------------------------------- */
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let activeIndex = 0;
  const galleryItems = [];

  galleryCards.forEach((card, idx) => {
    const src = card.getAttribute('data-gallery-src');
    const caption = card.getAttribute('data-caption') || '';
    galleryItems.push({ src, caption });

    card.addEventListener('click', () => {
      openLightbox(idx);
    });
  });

  function openLightbox(idx) {
    if (!lightbox) return;
    activeIndex = idx;
    renderLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function renderLightbox() {
    const item = galleryItems[activeIndex];
    if (item && lightboxImg) {
      lightboxImg.src = item.src;
      lightboxCaption.textContent = item.caption;
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      activeIndex = (activeIndex - 1 + galleryItems.length) % galleryItems.length;
      renderLightbox();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      activeIndex = (activeIndex + 1) % galleryItems.length;
      renderLightbox();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  /* --------------------------------------------------------------------------
   * 10. BOOKING MODAL
   * -------------------------------------------------------------------------- */
  const bookingModal = document.getElementById('modal-booking');
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');
  const bookingForm = document.getElementById('form-booking');
  const bookingSuccess = document.getElementById('modal-success');
  const dateInput = document.getElementById('f-date');

  const triggers = [
    document.getElementById('book-btn-nav'),
    document.getElementById('book-btn-hero'),
    document.getElementById('book-btn-visit')
  ];

  triggers.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openBookingModal();
      });
    }
  });

  function openBookingModal() {
    if (!bookingModal) return;
    if (dateInput && !dateInput.value) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.value = today;
      dateInput.min = today;
    }
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (bookingSuccess) bookingSuccess.style.display = 'none';
      if (bookingForm) {
        bookingForm.style.display = 'flex';
        bookingForm.reset();
      }
    }, 300);
  }

  if (modalClose) modalClose.addEventListener('click', closeBookingModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeBookingModal);

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      bookingForm.style.display = 'none';
      if (bookingSuccess) bookingSuccess.style.display = 'block';

      setTimeout(() => {
        window.location.href = 'tel:+79950919192';
      }, 1400);
    });
  }

  /* --------------------------------------------------------------------------
   * 11. MOBILE MENU (Triggers Side Info Drawer directly on mobile)
   * -------------------------------------------------------------------------- */
  const burger = document.getElementById('burger');
  if (burger) {
    burger.addEventListener('click', () => {
      openDrawer();
    });
  }

})();
