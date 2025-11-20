const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

reveals.forEach((section) => observer.observe(section));

// subtle parallax on hero device
const heroVisual = document.querySelector('.hero-visual');
const glow = document.querySelector('.glow');

if (heroVisual && glow) {
  heroVisual.addEventListener('mousemove', (event) => {
    const { left, top, width, height } = heroVisual.getBoundingClientRect();
    const x = ((event.clientX - left) / width - 0.5) * 12;
    const y = ((event.clientY - top) / height - 0.5) * 12;
    glow.style.transform = `translate(${x}px, ${y}px)`;
  });
}

// theme variations
const variationCards = document.querySelectorAll('.variation-card');
const bodyEl = document.body;

const updateButtons = (activeTheme) => {
  variationCards.forEach((card) => {
    const isActive = card.dataset.theme === activeTheme;
    card.classList.toggle('active', isActive);
    const button = card.querySelector('button');
    if (button) {
      button.textContent = isActive ? 'Using theme' : `Use ${card.dataset.theme}`;
    }
    const badge = card.querySelector('.badge');
    if (badge) {
      badge.textContent = isActive ? 'Current' : 'Alt';
    }
  });
};

const applyTheme = (theme) => {
  bodyEl.dataset.theme = theme;
  updateButtons(theme);
  localStorage.setItem('slate-theme', theme);
};

const savedTheme = localStorage.getItem('slate-theme');
if (savedTheme) {
  applyTheme(savedTheme);
}

variationCards.forEach((card) => {
  const theme = card.dataset.theme;
  const button = card.querySelector('button');
  const activate = (event) => {
    event?.stopPropagation();
    applyTheme(theme);
  };

  card.addEventListener('click', activate);
  if (button) button.addEventListener('click', activate);
});

// initialize default labels
updateButtons(bodyEl.dataset.theme || 'glass');
