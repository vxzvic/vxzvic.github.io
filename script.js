// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
}));

// Nav background on scroll
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal on scroll (staggered)
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 80}ms`;
    el.classList.add('in');
    setTimeout(() => (el.style.transitionDelay = ''), 900);
    io.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Active nav link
const sections = [...document.querySelectorAll('main section[id]')];
const links = [...navLinks.querySelectorAll('a')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    let id = entry.target.id;
    if (id === 'contact') return;
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

// Counters
const counters = document.querySelectorAll('[data-count]');
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target, target = +el.dataset.count;
    let n = 0;
    const tick = () => { n++; el.textContent = n; if (n < target) setTimeout(tick, 220); };
    tick();
    countIO.unobserve(el);
  });
});
counters.forEach(c => countIO.observe(c));

// Cursor-follow shine on glass cards
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// Category chips: highlight the category in view
const chips = [...document.querySelectorAll('.filters .chip')];
const catIO = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  chips.forEach(c => {
    const on = c.getAttribute('href') === '#' + e.target.id;
    c.classList.toggle('active', on);
    if (on) { const bar = c.parentElement; bar.scrollTo({ left: c.offsetLeft - bar.clientWidth / 2 + c.clientWidth / 2, behavior: 'smooth' }); }
  });
}), { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('.work-cat').forEach(c => catIO.observe(c));
const works = [...document.querySelectorAll('.work')];

// Lightbox
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('img');
const lbCap = lb.querySelector('figcaption');
let current = 0;
let group = works;
const visibleWorks = () => group;
function openLb(i) {
  const list = visibleWorks();
  current = (i + list.length) % list.length;
  const w = list[current], img = w.querySelector('img');
  lbImg.src = img.src; lbImg.alt = img.alt;
  lbCap.innerHTML = `${w.querySelector('b').textContent}<small>${w.querySelector('small').textContent}</small>`;
  lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLb() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
works.forEach(w => {
  w.tabIndex = 0;
  const open = () => { group = [...w.closest('.work-cat').querySelectorAll('.work')]; openLb(group.indexOf(w)); };
  w.addEventListener('click', open);
  w.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
});
lb.querySelector('.lb-close').addEventListener('click', closeLb);
lb.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); openLb(current - 1); });
lb.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); openLb(current + 1); });
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') openLb(current - 1);
  if (e.key === 'ArrowRight') openLb(current + 1);
});

// Copy email
const emailBtn = document.getElementById('emailCopy');
emailBtn.addEventListener('click', async () => {
  const label = emailBtn.querySelector('span');
  try { await navigator.clipboard.writeText('victorlacanienta2@gmail.com'); label.textContent = 'Copied!'; }
  catch { label.textContent = 'Select & copy'; }
  setTimeout(() => (label.textContent = 'Copy'), 1800);
});

// Subtle parallax on portrait
const visual = document.querySelector('.hero-visual');
if (visual && matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const frame = visual.querySelector('.portrait');
  window.addEventListener('pointermove', (e) => {
    const x = (e.clientX / innerWidth - 0.5) * 10;
    const y = (e.clientY / innerHeight - 0.5) * 10;
    frame.style.transform = `perspective(900px) rotateY(${x * 0.6}deg) rotateX(${-y * 0.6}deg)`;
  }, { passive: true });
}
