/* ================================================
   Navbar Component Rendering
   ================================================ */
function renderNavbar() {
  const placeholder = document.getElementById('navbar-placeholder');
  if (!placeholder) return;

  const navbarHTML = `
  <nav class="navbar" id="navbar">
    <div class="container nav-container">
      <a href="index.html#hero" class="nav-logo" aria-label="Inicio">PG</a>
      <button class="nav-toggle" id="navToggle" aria-label="Abrir menú" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="navLinks" role="list">
        <li><a href="index.html#about">Sobre mí</a></li>
        <li><a href="index.html#education">Educación</a></li>
        <li><a href="index.html#experience">Experiencia</a></li>
        <li><a href="index.html#skills">Habilidades</a></li>
        <li><a href="index.html#publications">Publicaciones</a></li>
        <li><a href="index.html#courses">Cursos</a></li>
        <li class="dropdown">
          <a href="temas.html" id="nav-temas">Temas ▾</a>
          <ul class="dropdown-menu">
            <li class="dropdown dropdown-nested">
              <a href="estructura-datos.html" id="nav-estructura">Estructura de Datos ▸</a>
              <ul class="dropdown-menu dropdown-submenu">
                <li><a href="recursividad.html" id="nav-recursividad">Recursividad</a></li>
              </ul>
            </li>
            <li class="dropdown dropdown-nested">
              <a href="computacion-grafica.html" id="nav-grafica">Computación Gráfica ▸</a>
              <ul class="dropdown-menu dropdown-submenu">
                <li><a href="computacion-grafica.html" class="sub-link-grafica">Geometría Aplicada</a></li>
              </ul>
            </li>
            <li class="dropdown dropdown-nested">
              <a href="computacion-paralela.html" id="nav-paralela">Computación Paralela ▸</a>
              <ul class="dropdown-menu dropdown-submenu">
                <li><a href="computacion-paralela.html" class="sub-link-paralela">Algoritmos y Sistemas de Cómputo Paralelo</a></li>
              </ul>
            </li>
          </ul>
        </li>
        <li><a href="fundamentos.html" id="nav-fundamentos">Ejercicios</a></li>
        <li><a href="index.html#contact">Contacto</a></li>
        <li class="theme-switch-wrapper">
          <button id="theme-toggle" class="btn-theme" title="Cambiar modo">🌓</button>
        </li>
      </ul>
    </div>
  </nav>
  `;

  placeholder.innerHTML = navbarHTML;

  // Manejo de estado activo según la URL
  const path = window.location.pathname;
  
  const addActive = (id) => {
    const el = document.getElementById(id) || document.querySelector(id);
    if (el) el.classList.add('active');
  };

  if (path.includes('recursividad.html')) {
    addActive('nav-temas'); addActive('nav-estructura'); addActive('nav-recursividad');
  } else if (path.includes('estructura-datos.html')) {
    addActive('nav-temas'); addActive('nav-estructura');
  } else if (path.includes('computacion-grafica.html')) {
    addActive('nav-temas'); addActive('nav-grafica'); addActive('.sub-link-grafica');
  } else if (path.includes('computacion-paralela.html')) {
    addActive('nav-temas'); addActive('nav-paralela'); addActive('.sub-link-paralela');
  } else if (path.includes('temas.html')) {
    addActive('nav-temas');
  } else if (path.includes('fundamentos.html')) {
    addActive('nav-fundamentos');
  }
}

// Ejecutar inmediatamente para inyectar el HTML antes de que los listeners se vinculen
renderNavbar();

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
