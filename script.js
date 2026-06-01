/* ═══════════════════════════════════════
   Thangaprabha J – Portfolio Script v5
   ═══════════════════════════════════════ */

// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('gone'), 700);
});

// ── NAV SCROLL ──
const nav    = document.getElementById('nav');
const topBtn = document.getElementById('topBtn');

window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 40);
  topBtn.classList.toggle('show', window.scrollY > 500);
  highlightNav();
}, { passive: true });

// ── MOBILE MENU ──
const burger  = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');

burger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
  burger.setAttribute('aria-expanded', isOpen);
});

navMenu.querySelectorAll('.nav-a').forEach(a => {
  a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    burger.setAttribute('aria-expanded', false);
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('open') && !nav.contains(e.target)) {
    navMenu.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    burger.setAttribute('aria-expanded', false);
  }
});

// ── ACTIVE NAV HIGHLIGHT ──
const allSections = document.querySelectorAll('section[id]');
const allNavAs    = document.querySelectorAll('.nav-a');

function highlightNav() {
  const pos = window.scrollY + 110;
  allSections.forEach(s => {
    if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
      allNavAs.forEach(a => a.classList.remove('on'));
      const match = document.querySelector(`.nav-a[href="#${s.id}"]`);
      if (match) match.classList.add('on');
    }
  });
}

// ── SCROLL TO TOP ──
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal, .fade-in, .slide-left, .slide-right');
const ro = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => ro.observe(el));

// ── COUNTER ANIMATION ──
function runCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const dur = 1800, step = 16;
  let cur = 0;
  const inc = target / (dur / step);
  const t = setInterval(() => {
    cur += inc;
    if (cur >= target) { el.textContent = Math.floor(target) + suffix; clearInterval(t); }
    else { el.textContent = Math.floor(cur) + suffix; }
  }, step);
}

const co = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => co.observe(el));

// ── PARALLAX ORBS ──
let ticking = false;
document.addEventListener('mousemove', (e) => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 25;
    const y = (e.clientY / window.innerHeight - 0.5) * 25;
    const speeds = [0.4, -0.3, 0.35, -0.25];
    document.querySelectorAll('.orb').forEach((o, i) => {
      o.style.transform = `translate(${x * speeds[i]}px, ${y * speeds[i]}px)`;
    });
    ticking = false;
  });
});

// ── PROJECT CARD TILT ──
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
});

// ── ACHIEVEMENT CARD STAGGER ──
document.querySelectorAll('.ach-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.07}s`;
});

// ── TECH MARQUEE PAUSE ON HOVER ──
const marqueeWrap = document.querySelector('.tech-marquee-wrap');
const marquee     = document.querySelector('.tech-marquee');
if (marqueeWrap && marquee) {
  marqueeWrap.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
  marqueeWrap.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
}

// ── CONTACT FORM — Fixed: mailto fallback so email actually works ──
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal    = document.getElementById('name')?.value?.trim() || '';
    const emailVal   = document.getElementById('email')?.value?.trim() || '';
    const subjectVal = document.getElementById('subject')?.value?.trim() || 'Portfolio Contact';
    const msgVal     = document.getElementById('message')?.value?.trim() || '';

    // Build mailto link so pressing Send actually opens email client
    const recipient = 'thangaprabhaj253@gmail.com';
    const subject   = encodeURIComponent(subjectVal || 'Portfolio Inquiry');
    const body      = encodeURIComponent(
      `Hi Thangaprabha,\n\nMy name is ${nameVal} (${emailVal}).\n\n${msgVal}`
    );
    const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    // Button feedback
    const btn = document.getElementById('submitBtn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent';
    btn.style.background = 'linear-gradient(135deg, #5a35a8 0%, #a8438a 100%)';
    btn.style.opacity = '0.85';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.opacity = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
}

// ── EMAIL LINK FALLBACK — ensure all mailto links work —

document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
  link.addEventListener('click', (e) => {
    // Allow default behaviour (opens mail client) — just ensure no JS overrides
    // Force open in same window which is the correct mailto behaviour
    window.location.href = link.href;
    e.preventDefault();
  });
});