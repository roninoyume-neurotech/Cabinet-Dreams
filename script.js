// ===== Theme Toggle =====
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function setTheme(mode){
  if(mode === 'light'){ root.classList.add('light'); }
  else { root.classList.remove('light'); }
  localStorage.setItem('cd-theme', mode);
  if(themeToggle) themeToggle.textContent = root.classList.contains('light') ? '☀' : '☾';
}
(function initTheme(){
  const saved = localStorage.getItem('cd-theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  setTheme(saved ? saved : (prefersLight ? 'light' : 'dark'));
})();
if(themeToggle){
  themeToggle.addEventListener('click', () => {
    const next = root.classList.contains('light') ? 'dark' : 'light';
    setTheme(next);
  });
}

// ===== Footer Year =====
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

// ===== Contact Modal (site-wide) =====
const contactModal = document.getElementById('contactModal');
document.querySelectorAll('[data-open-contact]').forEach(btn => {
  btn.addEventListener('click', () => {
    if(!contactModal) return;
    contactModal.setAttribute('aria-hidden', 'false');
    contactModal.setAttribute('aria-modal', 'true');
  });
});
if(contactModal){
  contactModal.addEventListener('click', (e) => {
    if(e.target.hasAttribute('data-close') || e.target === contactModal){
      contactModal.setAttribute('aria-hidden', 'true');
      contactModal.setAttribute('aria-modal', 'false');
    }
  });
}
function wireContactForms(){
  document.querySelectorAll('#contactFormModal, #contactFormPage').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      alert(`Thanks, ${data.name}! We'll reply to ${data.email} soon.`);
      form.reset();
      if(contactModal){
        contactModal.setAttribute('aria-hidden', 'true');
        contactModal.setAttribute('aria-modal', 'false');
      }
    });
  });
}
wireContactForms();

// ===== Subtle background drift =====
(function animateParticles(){
  const el = document.getElementById('particles');
  if(!el) return;
  let t = 0;
  function step(){ t += 0.0025; el.style.transform = `translateY(${Math.sin(t)*4}px)`; requestAnimationFrame(step); }
  requestAnimationFrame(step);
})();

// ===== Interactive D-door -> About reveal (Home) =====
(function doorToAbout(){
  const trigger = document.getElementById('doorTrigger');
  const about = document.getElementById('about');
  if(!trigger || !about) return;

  const doorPanel = trigger.querySelector('.door-panel');

  function openAbout(){
    // open door animation
    doorPanel.style.animation = 'none';
    doorPanel.style.transform = 'rotateY(-95deg)';
    // reveal about
    about.classList.add('open');
    about.setAttribute('aria-hidden', 'false');
    // smooth scroll into view
    setTimeout(() => { about.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 120);
    // reset idle animation after a moment
    setTimeout(() => { doorPanel.style.animation = ''; }, 1500);
  }

  trigger.addEventListener('click', openAbout);
  trigger.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openAbout(); }
  });
})();

// ===== Projects: click to highlight one, dim others =====
(function projectHighlight(){
  const shelf = document.getElementById('projectShelf');
  if(!shelf) return;
  const cards = [...shelf.querySelectorAll('.card.project')];

  function setActive(card){
    const isActive = card.classList.contains('active');
    // reset all
    cards.forEach(c => { c.classList.remove('active'); c.classList.remove('dimmed'); });
    if(!isActive){
      card.classList.add('active');
      cards.filter(c => c !== card).forEach(c => c.classList.add('dimmed'));
    }
  }

  cards.forEach(card => {
    card.addEventListener('click', () => setActive(card));
    card.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); setActive(card); }
    });
  });
})();

// ===== Members: modal bios + hover jank fix =====
(function membersModal(){
  const modal = document.getElementById('memberModal');
  if(!modal) return;
  const nameEl = document.getElementById('mmName');
  const roleEl = document.getElementById('mmRole');
  const bioEl  = document.getElementById('mmBio');

  // Hover jank fix: ensure containers have stable height (handled in CSS: min-height on footer, transforms only)
  // JS side: nothing to recalc layout; only set transforms/opacity.

  document.querySelectorAll('.person').forEach(btn => {
    btn.addEventListener('click', () => {
      nameEl.textContent = btn.getAttribute('data-name') || 'Member';
      roleEl.textContent = btn.getAttribute('data-role') || '';
      bioEl.textContent  = btn.getAttribute('data-bio')  || '';
      modal.setAttribute('aria-hidden', 'false');
      modal.setAttribute('aria-modal', 'true');
    });
    btn.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); btn.click(); }
    });
  });

  modal.addEventListener('click', (e) => {
    if(e.target.hasAttribute('data-close') || e.target === modal){
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('aria-modal', 'false');
    }
  });
})();
