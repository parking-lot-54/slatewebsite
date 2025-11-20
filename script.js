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
