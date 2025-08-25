// ========== Theme Toggle ==========
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

// ========== Footer Year ==========
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ========== Contact Modal ==========
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

// ========== Fake form handler (demo) ==========
function handleContactSubmit(form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    alert(`Thanks, ${data.name}! We'll reply to ${data.email} soon.`);
    form.reset();
    if(contactModal) {
      contactModal.setAttribute('aria-hidden', 'true');
      contactModal.setAttribute('aria-modal', 'false');
    }
  });
}
document.querySelectorAll('#contactFormModal, #contactFormPage').forEach(f => handleContactSubmit(f));

// ========== Subtle particle drift enhancer (optional movement) ==========
(function animateParticles(){
  const el = document.getElementById('particles');
  if(!el) return;
  let t = 0;
  function step(){
    t += 0.0025;
    el.style.transform = `translateY(${Math.sin(t)*4}px)`;
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();

// ========== Accessibility niceties ==========
document.querySelectorAll('.person').forEach(p => {
  p.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      const bio = p.querySelector('.bio');
      if(bio){
        const visible = getComputedStyle(bio).display !== 'none';
        bio.style.display = visible ? 'none' : 'block';
      }
      e.preventDefault();
    }
  });
});
// --- IGNORE --- //