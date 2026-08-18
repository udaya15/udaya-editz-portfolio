/* ==========================================================================
   UDAYA EDITZ — script.js
   Handles: preloader, sticky header, mobile nav, GSAP scroll reveals,
   portfolio filtering, project lightbox modal, and showreel modal.
   ========================================================================== */
(() => {
  'use strict';

  /* -------------------- Preloader -------------------- */
  const preloader   = document.getElementById('preloader');
  const loaderMark  = document.getElementById('loaderMark');
  const loaderCode  = document.getElementById('loaderCode');
  const BRAND = 'UDAYA EDITZ';

  function buildLoaderText () {
    loaderMark.innerHTML = '';
    BRAND.split('').forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = `${i * 0.045}s`;
      loaderMark.appendChild(span);
    });
  }
  buildLoaderText();

  // Fake but bounded timecode tick while assets load
  let tc = 0;
  const tcInterval = setInterval(() => {
    tc += Math.floor(Math.random() * 8) + 4;
    const f = String(tc % 30).padStart(2, '0');
    const s = String(Math.floor(tc / 30) % 60).padStart(2, '0');
    loaderCode.textContent = `LOADING TIMELINE — 00:00:${s}:${f}`;
  }, 90);

  window.addEventListener('load', () => {
    setTimeout(() => {
      clearInterval(tcInterval);
      preloader.classList.add('loaded');
      document.body.style.overflow = '';
      initScrollDrivenUI();
    }, 900);
  });
  // Safety net in case 'load' is slow/blocked
  setTimeout(() => { if (!preloader.classList.contains('loaded')) window.dispatchEvent(new Event('load')); }, 3500);

  /* -------------------- Sticky header + mobile nav -------------------- */
  const header = document.getElementById('siteHeader');
  const burger = document.getElementById('burgerBtn');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    burger.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));

  /* -------------------- Timeline scrubber (signature nav) -------------------- */
  const SECTIONS = ['home', 'portfolio', 'services', 'why', 'about', 'contact'];
  const tlFill = document.getElementById('tlFill');
  const tlPlayhead = document.getElementById('tlPlayhead');
  const tlTrack = document.getElementById('tlTrack');
  const tlCode = document.getElementById('tlCode');
  const tlLabel = document.getElementById('tlLabel');

  function frameCode(totalFrames) {
    const s = Math.floor(totalFrames / 30);
    const f = Math.floor(totalFrames % 30);
    return `${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
  }

  function paintMarkers() {
    tlTrack.querySelectorAll('.tl-marker').forEach(m => m.remove());
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const pct = Math.min(100, Math.max(0, (el.offsetTop / docH) * 100));
      const mark = document.createElement('div');
      mark.className = 'tl-marker';
      mark.style.left = pct + '%';
      mark.dataset.section = id;
      tlTrack.appendChild(mark);
    });
  }

  function updateTimeline() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    tlFill.style.width = pct + '%';
    tlPlayhead.style.left = pct + '%';

    const totalFrames = Math.round((pct / 100) * 900); // fake 30s timeline
    tlCode.textContent = `${frameCode(totalFrames)} / 30:00`;

    // Active section label + marker highlight
    let current = SECTIONS[0];
    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - window.innerHeight * 0.4) current = id;
    });
    tlLabel.textContent = current.toUpperCase();
    tlTrack.querySelectorAll('.tl-marker').forEach(m => {
      m.classList.toggle('active', m.dataset.section === current);
    });
  }

  tlTrack.addEventListener('click', (e) => {
    const rect = tlTrack.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: docH * pct, behavior: 'smooth' });
  });

  function initScrollDrivenUI() {
    paintMarkers();
    updateTimeline();
    window.addEventListener('scroll', updateTimeline, { passive: true });
    window.addEventListener('resize', () => { paintMarkers(); updateTimeline(); });
    initGSAP();
  }

  /* -------------------- GSAP scroll reveals -------------------- */
  function initGSAP() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero headline lines
    gsap.to('.hero h1 .line span', {
      y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out', delay: 0.1
    });
    gsap.set('.hero h1 .line span', { y: 40, opacity: 0 });
    gsap.to('.hero h1 .line span', { y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out', delay: 0.1 });

    gsap.utils.toArray('section:not(.hero)').forEach(sec => {
      const targets = sec.querySelectorAll('.section-head, .eyebrow, .card, .svc-card, .why-card, .about-visual, .about-copy, .contact-info, .direct-contact-card');
      if (!targets.length) return;
      gsap.set(targets, { opacity: 0, y: 26 });
      ScrollTrigger.batch(targets, {
        start: 'top 88%',
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out' })
      });
    });

    // Services cards get a slightly livelier scale+rotate entrance, and
    // their icons pop in a beat after the card for extra motion.
    const svcCards = gsap.utils.toArray('.svc-card');
    if (svcCards.length) {
      gsap.set(svcCards, { opacity: 0, y: 30, scale: 0.92 });
      gsap.set(svcCards.map(c => c.querySelector('.ic')), { opacity: 0, scale: 0.4, rotate: -20 });
      ScrollTrigger.batch(svcCards, {
        start: 'top 88%',
        onEnter: batch => {
          gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.09, ease: 'back.out(1.6)' });
          gsap.to(batch.map(c => c.querySelector('.ic')), {
            opacity: 1, scale: 1, rotate: 0, duration: 0.6, stagger: 0.09, delay: 0.12, ease: 'back.out(2)'
          });
        }
      });
    }
  }

  /* -------------------- Portfolio card video previews -------------------- */
  const cardVids = document.querySelectorAll('.card-vid');
  if (cardVids.length && 'IntersectionObserver' in window) {
    const vidObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const v = entry.target;
        if (entry.isIntersecting) {
          if (!v.src && v.dataset.src) v.src = v.dataset.src; // lazy-load on first view
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.35 });
    cardVids.forEach(v => vidObserver.observe(v));
  } else {
    // Fallback: load everything immediately if IntersectionObserver isn't supported
    cardVids.forEach(v => { if (v.dataset.src) v.src = v.dataset.src; });
  }

  /* -------------------- Portfolio filters -------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('#portfolioGrid .card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(card => {
        const cardCats = card.dataset.category.split(/\s+/); // supports multi-category cards e.g. "short mobile"
        const match = f === 'all' || cardCats.includes(f);
        card.classList.toggle('hide', !match);
        if (match) requestAnimationFrame(() => card.classList.add('show'));
        else card.classList.remove('show');
      });
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });

  /* -------------------- Modals -------------------- */
  function openModal(modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modal.querySelectorAll('video').forEach(v => v.pause());
    const iframe = modal.querySelector('iframe');
    if (iframe) iframe.src = iframe.src; // stop playback by reloading src
  }
  document.querySelectorAll('.modal [data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
  });
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.querySelectorAll('.modal.open').forEach(closeModal);
  });

  // Showreel
  const showreelBtn = document.getElementById('showreelBtn');
  const showreelModal = document.getElementById('showreelModal');
  if (showreelBtn) showreelBtn.addEventListener('click', () => openModal(showreelModal));

  // Project cards -> lightbox
  const projectModal = document.getElementById('projectModal');
  const projectModalBox = document.getElementById('projectModalBox');
  const projectModalVideo = document.getElementById('projectModalVideo');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalTc = document.getElementById('projectModalTc');
  const projectModalSw = document.getElementById('projectModalSw');
  const PROJECTS = window.__PROJECTS__ || [];

  function openProject(index) {
    const p = PROJECTS[index];
    if (!p) return;
    projectModalBox.classList.toggle('vertical', p.orientation === 'vertical');
    projectModalTitle.textContent = p.title;
    projectModalTc.textContent = p.timecode;
    projectModalSw.textContent = p.software;
    projectModalVideo.innerHTML = `
      <video controls playsinline style="width:100%;height:100%;background:#000;">
        <source src="${p.video}" type="video/mp4">
      </video>`;
    openModal(projectModal);
  }

  document.querySelectorAll('#portfolioGrid .card').forEach(card => {
    card.addEventListener('click', () => openProject(Number(card.dataset.index)));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(Number(card.dataset.index)); }
    });
  });

})();