const signupForm = document.getElementById('signupForm');
const formNote = document.getElementById('formNote');
const storageKey = 'slateAlphaSignups';

/**
 * Email collection (static-site + free)
 *
 * Recommended: Google Sheets via Google Forms
 *
 * How it works:
 * - You create a Google Form with an Email field.
 * - You connect the form to a Google Sheet (Responses tab → Link to Sheets).
 * - This site POSTs to the form's `formResponse` endpoint.
 *
 * Setup:
 * 1) Create a Google Form with a single question "Email" (Short answer, email validation).
 * 2) In the Form: ⋮ → "Get pre-filled link" → enter a dummy email → copy the URL.
 *    It will contain `entry.<ID>=...` — that <ID> is your EMAIL entry ID.
 * 3) The URL also contains your Form ID. Your action endpoint should be:
 *    https://docs.google.com/forms/d/e/<FORM_ID>/formResponse
 */
const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSecxu-ggxB8asv-QOdmgOekIrS7gSlX46xg_QaTlGw7_UoUCQ/formResponse';
const GOOGLE_FORM_EMAIL_ENTRY_ID = '132288715';

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
  typeof GOOGLE_FORM_ACTION_URL === 'string' &&
  GOOGLE_FORM_ACTION_URL.trim().length > 0 &&
  typeof GOOGLE_FORM_EMAIL_ENTRY_ID === 'string' &&
  GOOGLE_FORM_EMAIL_ENTRY_ID.trim().length > 0;

const isLocalPreview = () =>
  window.location.protocol === 'file:' ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const submitEmail = async (email) => {
  const entryKey = `entry.${GOOGLE_FORM_EMAIL_ENTRY_ID.trim()}`;
  const payload = new URLSearchParams();
  payload.set(entryKey, email);

  // Note: Google Forms does not send CORS headers. Using `no-cors` still submits successfully,
  // but we cannot read the response. We'll treat a completed fetch as success.
  await fetch(GOOGLE_FORM_ACTION_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: payload.toString(),
  });
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
      setNote('Thanks for signing up to the waitlist!', 'success');
      signupForm.reset();
    } catch (error) {
      setNote('Something went wrong — please try again.', 'error');
    } finally {
      setBusy(false);
    }
  });
}
