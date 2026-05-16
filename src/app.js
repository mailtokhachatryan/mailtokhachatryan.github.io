// ===== Typewriter =====
const phrases = [
  "Senior Java Software Engineer | 6+ Years",
  "Java • Spring • Micronaut • Go",
  "Building reactive microservices at OMD",
  "Cloud-Native • Microservices • gRPC"
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const twEl = document.getElementById('typewriter');

function type() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    twEl.textContent = current.substring(0, charIdx++);
    if (charIdx > current.length) { deleting = true; setTimeout(type, 2000); return; }
    setTimeout(type, 55);
  } else {
    twEl.textContent = current.substring(0, charIdx--);
    if (charIdx < 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(type, 400); return; }
    setTimeout(type, 25);
  }
}
type();

// ===== Navbar scroll =====
const nav = document.querySelector('.navbar');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== Scroll Reveal (IntersectionObserver) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // Stagger children with delay
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('animate-in'), delay);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('[data-animate]').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 6) * 80}ms`;
  revealObserver.observe(el);
});

// ===== Spotlight Card Effect (mouse tracking) =====
document.querySelectorAll('.spotlight-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});

// ===== GitHub Repos =====
const LANG_COLORS = {
  Java: '#b07219', Kotlin: '#A97BFF', Python: '#3572A5',
  JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26',
  'C++': '#f34b7d', CSS: '#563d7c'
};

// Projects section is statically rendered in index.html. Register tilt + spotlight on the
// .repo-card elements so they get the same interaction as the rest of the site.
if (window.VanillaTilt) {
  VanillaTilt.init(document.querySelectorAll('.repo-card'), {
    max: 8, speed: 400, glare: true, "max-glare": 0.1
  });
}

// ===== Parallax Aurora Blobs on scroll =====
const blobs = document.querySelectorAll('.aurora-blob');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      blobs.forEach((blob, i) => {
        const speed = (i + 1) * 0.03;
        blob.style.transform = `translateY(${scrollY * speed}px)`;
      });
      ticking = false;
    });
    ticking = true;
  }
});

// ===== Custom Cursor =====
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (cursorDot && cursorRing) {
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });
  
  const renderCursor = () => {
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  document.querySelectorAll('a, button, .magnetic, .repo-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

// ===== Scroll Progress =====
const progressBar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
  if (progressBar) {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = `${(winScroll / height) * 100}%`;
  }
});

// ===== Magnetic Buttons =====
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0px, 0px)';
  });
});

// ===== 3D Tilt Cards =====
if (window.VanillaTilt) {
  VanillaTilt.init(document.querySelectorAll('.spotlight-card'), {
    max: 3,
    speed: 400,
    glare: true,
    "max-glare": 0.05
  });
}

// ===== Easter Egg Terminal =====
let clicks = 0;
let clickTimer;
const avatar = document.querySelector('.hero-avatar');
const overlay = document.getElementById('terminal-overlay');
const termInput = document.getElementById('term-input');
const termOutput = document.getElementById('term-output');

if (avatar && overlay) {
  avatar.addEventListener('click', () => {
    clicks++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => clicks = 0, 1000);
    if (clicks >= 5) {
      clicks = 0;
      overlay.classList.remove('hidden');
      termInput.focus();
    }
  });
  
  document.getElementById('term-close').addEventListener('click', () => {
    overlay.classList.add('hidden');
  });

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = termInput.value.trim().toLowerCase();
      termInput.value = '';
      
      const pCmd = document.createElement('p');
      pCmd.innerHTML = `<span style="color:var(--green)">➜  ~</span> ${val}`;
      termOutput.appendChild(pCmd);

      const pRes = document.createElement('p');
      if (val === 'help') pRes.innerHTML = 'Commands: help, whoami, skills, contact, clear, exit';
      else if (val === 'whoami') pRes.innerHTML = 'Aghasi Khachatryan - Senior Java Software Engineer @ OMD. Java, Spring, Micronaut, Go.';
      else if (val === 'skills') pRes.innerHTML = 'Java SE/EE, Spring Boot, Micronaut, Go, gRPC, PostgreSQL, MongoDB, Kafka, Kubernetes, AWS, Docker';
      else if (val === 'contact') pRes.innerHTML = 'Email: mailtokhachatryan96@gmail.com | Phone: +374 94 657895';
      else if (val === 'clear') { termOutput.innerHTML = ''; return; }
      else if (val === 'exit') { overlay.classList.add('hidden'); return; }
      else if (val !== '') pRes.innerHTML = `zsh: command not found: ${val}`;
      
      if (val !== '') {
        pRes.style.color = 'var(--text-dim)';
        termOutput.appendChild(pRes);
      }
      termOutput.scrollTop = termOutput.scrollHeight;
    }
  });
}
