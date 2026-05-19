/* ===========================
   THANGAPRABHA J — PORTFOLIO SCRIPTS
   Cinematic interactions & animations
=========================== */

// ── Cursor Glow ──────────────────────────────────────────────
(function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx, cy = my;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animate() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    raf = requestAnimationFrame(animate);
  }

  animate();

  // Hide on touch devices
  document.addEventListener('touchstart', () => {
    glow.style.opacity = '0';
    cancelAnimationFrame(raf);
  }, { once: true });
})();


// ── Custom Cursor ─────────────────────────────────────────────
(function initCursor() {
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (isTouchDevice) {
    document.body.style.cursor = 'auto';
    return;
  }

  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    width: 8px; height: 8px;
    background: #c9993a;
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease, width 0.2s ease, height 0.2s ease, opacity 0.2s ease;
    will-change: left, top;
  `;
  document.body.appendChild(dot);

  const ring = document.createElement('div');
  ring.style.cssText = `
    position: fixed;
    width: 28px; height: 28px;
    border: 1px solid rgba(201,153,58,0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99998;
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
    will-change: left, top;
  `;
  document.body.appendChild(ring);

  let rx = 0, ry = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    dotX = e.clientX;
    dotY = e.clientY;
    dot.style.left = dotX + 'px';
    dot.style.top  = dotY + 'px';
  });

  function animateRing() {
    rx += (dotX - rx) * 0.12;
    ry += (dotY - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const interactives = 'a, button, .project-card, .skill-tag, .stat-card, input, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) {
      dot.style.width = '12px';
      dot.style.height = '12px';
      ring.style.width = '44px';
      ring.style.height = '44px';
      ring.style.borderColor = 'rgba(201,153,58,0.8)';
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) {
      dot.style.width = '8px';
      dot.style.height = '8px';
      ring.style.width = '28px';
      ring.style.height = '28px';
      ring.style.borderColor = 'rgba(201,153,58,0.5)';
    }
  });
})();


// ── Navigation ────────────────────────────────────────────────
(function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  // Scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.querySelectorAll('span').forEach((s, i) => {
        if (isOpen) {
          if (i === 0) s.style.cssText = 'transform: rotate(45deg) translate(4px, 4px)';
          if (i === 1) s.style.cssText = 'opacity: 0';
          if (i === 2) s.style.cssText = 'transform: rotate(-45deg) translate(4px, -4px)';
        } else {
          s.style.cssText = '';
        }
      });
    });

    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
      });
    });
  }
})();


// ── Scroll Reveal ─────────────────────────────────────────────
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — keep the animation persistent
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  els.forEach(el => observer.observe(el));
})();


// ── Hero name cinematic reveal ────────────────────────────────
(function initHeroReveal() {
  const heroEls = document.querySelectorAll('.hero .reveal-up');
  heroEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 300 + i * 180);
  });
})();


// ── 3D Tilt on Project Cards ──────────────────────────────────
(function initCardTilt() {
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (isTouchDevice) return;

  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -6;
      const tiltY = dx *  6;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
      card.style.boxShadow = `
        ${-tiltY * 2}px ${tiltX * 2}px 40px rgba(200,132,58,0.15),
        0 20px 60px rgba(200,132,58,0.1)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
})();


// ── Smooth Scroll ─────────────────────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ── Active Nav Link ───────────────────────────────────────────
(function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--amber-soft)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


// ── Ambient Hero Parallax ────────────────────────────────────
(function initParallax() {
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (isTouchDevice) return;

  const orbs = document.querySelectorAll('.hero-orb');
  const flare = document.querySelector('.hero-lens-flare');

  document.addEventListener('mousemove', (e) => {
    const rx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const ry = (e.clientY / window.innerHeight - 0.5) * 2;

    orbs.forEach((orb, i) => {
      const factor = [12, 20, 30][i] || 15;
      orb.style.transform = `translate(${rx * factor}px, ${ry * factor}px)`;
    });

    if (flare) {
      flare.style.transform = `translate(${rx * 8}px, ${ry * 8}px)`;
    }
  });
})();


// ── Contact Form ──────────────────────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
    btn.disabled = true;
    span.textContent = 'Sending…';

    // Simulate send (replace with actual API call / EmailJS etc.)
    setTimeout(() => {
      btn.style.display = 'none';
      successEl.classList.add('show');
      form.querySelectorAll('input, textarea').forEach(el => {
        el.value = '';
        el.blur();
      });
    }, 1500);
  });
})();


// ── Skill Tag Hover Glow ─────────────────────────────────────
(function initSkillGlow() {
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.boxShadow = '0 0 16px rgba(200,132,58,0.2)';
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.boxShadow = '';
    });
  });
})();


// ── Stats Counter Animation ───────────────────────────────────
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el = entry.target;
      const sup = el.querySelector('sup');
      const supText = sup ? sup.textContent : '';
      const numText = el.textContent.replace(supText, '').trim();
      const target = parseFloat(numText);
      const isDecimal = numText.includes('.');
      let current = 0;
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        current = target * ease;
        const display = isDecimal ? current.toFixed(1) : Math.round(current).toString();
        el.innerHTML = display + (sup ? `<sup>${supText}</sup>` : '');
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();


// ── Page load fade-in ─────────────────────────────────────────
(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 80);
  });
})();