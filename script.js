const signupForm = document.getElementById('signupForm');
const formNote = document.getElementById('formNote');
const storageKey = 'slateAlphaSignups';

/**
 * Email collection (static-site friendly)
 *
 * Recommended: Formspree
 * 1) Create a form in Formspree
 * 2) Paste your endpoint below, e.g. https://formspree.io/f/xxxxxxx
 */
const SIGNUP_ENDPOINT = '';

const getStoredSignups = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) ?? [];
  } catch (error) {
    return [];
  }
};

const hasStoredSignup = (email) => {
  const signups = getStoredSignups();
  const normalized = email.trim().toLowerCase();
  return signups.some((entry) => entry.email === normalized);
};

const rememberSignup = (email) => {
  const signups = getStoredSignups();
  const normalized = email.trim().toLowerCase();
  const exists = signups.some((entry) => entry.email === normalized);
  if (exists) return;
  signups.push({ email: normalized, submittedAt: new Date().toISOString() });
  localStorage.setItem(storageKey, JSON.stringify(signups));
};

const setNote = (message, state) => {
  if (!formNote) return;
  formNote.textContent = message;
  if (state) {
    formNote.dataset.state = state;
  } else {
    delete formNote.dataset.state;
  }
};

const setBusy = (busy) => {
  if (!signupForm) return;
  const emailInput = signupForm.querySelector('input[name="email"]');
  const submitButton = signupForm.querySelector('button[type="submit"]');
  if (emailInput) emailInput.disabled = busy;
  if (submitButton) submitButton.disabled = busy;
};

const isEndpointConfigured = () =>
  typeof SIGNUP_ENDPOINT === 'string' && SIGNUP_ENDPOINT.trim().length > 0;

const isLocalPreview = () =>
  window.location.protocol === 'file:' ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const submitEmail = async (email) => {
  const payload = new FormData();
  payload.append('email', email);
  payload.append('source', window.location.href);

  const response = await fetch(SIGNUP_ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: payload,
  });

  if (!response.ok) {
    throw new Error('Signup request failed');
  }
};

if (signupForm) {
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(signupForm);
    const email = formData.get('email');
    if (!email) return;

    const company = formData.get('company');
    if (typeof company === 'string' && company.trim().length > 0) {
      // Honeypot: likely a bot. Behave as if we succeeded.
      signupForm.reset();
      setNote('Thanks — you’re on the list.', 'success');
      return;
    }

    const normalizedEmail = email.toString().trim().toLowerCase();

    if (hasStoredSignup(normalizedEmail)) {
      setNote('You’re already on the early access list. We’ll be in touch soon.', 'success');
      signupForm.reset();
      return;
    }

    if (!isEndpointConfigured()) {
      if (isLocalPreview()) {
        rememberSignup(normalizedEmail);
        signupForm.reset();
        setNote('Saved locally (preview). Configure SIGNUP_ENDPOINT in script.js to collect real signups.', 'success');
      } else {
        setNote('Signup is temporarily unavailable. Please try again soon.', 'error');
      }
      return;
    }

    try {
      setBusy(true);
      setNote('Submitting…', '');
      await submitEmail(normalizedEmail);
      rememberSignup(normalizedEmail);
      setNote('Thanks for signing up! We’ll reach out with alpha access details.', 'success');
      signupForm.reset();
    } catch (error) {
      setNote('Something went wrong — please try again.', 'error');
    } finally {
      setBusy(false);
    }
  });
}
