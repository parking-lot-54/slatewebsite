const signupForm = document.getElementById('signupForm');
const formNote = document.getElementById('formNote');
const storageKey = 'slateAlphaSignups';

const getStoredSignups = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) ?? [];
  } catch (error) {
    return [];
  }
};

const storeSignup = (email) => {
  const signups = getStoredSignups();
  const normalized = email.trim().toLowerCase();
  const exists = signups.some((entry) => entry.email === normalized);
  if (exists) {
    return { status: 'exists' };
  }
  signups.push({ email: normalized, submittedAt: new Date().toISOString() });
  localStorage.setItem(storageKey, JSON.stringify(signups));
  return { status: 'stored' };
};

if (signupForm) {
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(signupForm);
    const email = formData.get('email');
    if (!email) return;
    const result = storeSignup(email.toString());
    if (formNote) {
      formNote.textContent = result.status === 'exists'
        ? 'You are already on the early access list. We will be in touch soon.'
        : 'Thanks for signing up! We will reach out with alpha access details.';
    }
    signupForm.reset();
  });
}
