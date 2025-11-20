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

// Persona carousel controls
const track = document.getElementById('personaTrack');
const prev = document.querySelector('.carousel-btn.prev');
const next = document.querySelector('.carousel-btn.next');

const scrollByCard = (direction) => {
  if (!track) return;
  const card = track.querySelector('.persona-card');
  const amount = card ? card.clientWidth + 18 : 300;
  track.scrollBy({ left: direction * amount, behavior: 'smooth' });
};

prev?.addEventListener('click', () => scrollByCard(-1));
next?.addEventListener('click', () => scrollByCard(1));

// Slight hero parallax glow
const hero = document.querySelector('.hero');
const halos = document.querySelectorAll('.halo');

if (hero && halos.length) {
  hero.addEventListener('mousemove', (event) => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const x = (event.clientX - left - width / 2) / width;
    const y = (event.clientY - top - height / 2) / height;
    halos.forEach((halo, idx) => {
      const intensity = idx === 0 ? 10 : 14;
      halo.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
    });
  });
}
