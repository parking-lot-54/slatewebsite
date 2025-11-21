// Initialize lucide icons
if (window.lucide) {
  window.lucide.createIcons();
}

// Mobile navigation toggle
const mobileToggle = document.getElementById('mobileToggle');
const mobileNav = document.getElementById('mobileNav');
const navIcon = mobileToggle?.querySelector('i');

mobileToggle?.addEventListener('click', () => {
  const isOpen = !mobileNav?.classList.contains('hidden');
  mobileNav?.classList.toggle('hidden');
  if (navIcon) {
    navIcon.setAttribute('data-lucide', isOpen ? 'menu' : 'x');
    window.lucide?.createIcons();
  }
});

// Sticky nav style on scroll
const siteNav = document.getElementById('siteNav');
const updateNav = () => {
  if (!siteNav) return;
  const scrolled = window.scrollY > 40;
  siteNav.classList.toggle('shadow-lg', scrolled);
};
window.addEventListener('scroll', updateNav);
updateNav();
