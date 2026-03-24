/* ================================================
   Navbar — shadow on scroll
   ================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

/* ================================================
   Mobile nav — toggle
   ================================================ */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close on link click (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* ================================================
   Active nav link on scroll
   ================================================ */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {
  threshold: 0.25,
  rootMargin: '-64px 0px -45% 0px'
});

sections.forEach(s => sectionObserver.observe(s));

/* ================================================
   Fade-in animation on scroll
   ================================================ */
const fadeTargets = document.querySelectorAll(
  '.exp-card, .skill-group, .pub-card, .course-card, .stat-card, .timeline-item, .research-highlight'
);

// Set initial hidden state
fadeTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
});

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Small stagger per sibling index
      const siblings = Array.from(entry.target.parentElement.children);
      const delay    = siblings.indexOf(entry.target) * 55;

      setTimeout(() => {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);

      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeTargets.forEach(el => fadeObserver.observe(el));

/* ================================================
   Theme System (Light/Dark)
   ================================================ */
function initGlobalTheme() {
    const root = document.documentElement;
    const toggles = document.querySelectorAll('#theme-toggle');
    
    // Check saved preference
    const savedTheme = localStorage.getItem('fund-theme');
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
    }

    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('fund-theme', newTheme);
            
            // If showToast exists (in fundamentos page), use it
            if (typeof showToast === 'function') {
                showToast(`Modo ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`, 'info');
            }
        });
    });

    // Listen to system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('fund-theme')) {
            root.removeAttribute('data-theme');
        }
    });
}

initGlobalTheme();
