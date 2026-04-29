/**
 * Shared Contact Modal Loader
 * Injects and manages the contact modal on any page
 * Include this script once per page: <script src="./assets/modal-loader.js"></script>
 */

// Modal HTML template
const MODAL_HTML = `
<div id="contact-modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">Quick intake form</h2>
      <button class="modal-close" data-close-modal="true" type="button">✕</button>
    </div>
    <p class="modal-description">
      Tell us the problem. The inputs (data, systems, approvals). The smallest shape that could solve it. We'll be in touch within one business day.
    </p>

    <form class="contact-form" id="contact-form">
      <div class="form-row-split">
        <div class="form-row">
          <label for="modal-name">Your name</label>
          <input id="modal-name" name="name" type="text" required />
        </div>
        <div class="form-row">
          <label for="modal-email">Email</label>
          <input id="modal-email" name="email" type="email" required />
        </div>
      </div>

      <div class="form-row">
        <label for="modal-company">Company / project</label>
        <input id="modal-company" name="company" type="text" />
      </div>

      <div class="form-row-split">
        <div class="form-row">
          <label for="modal-practice">Which practice fits?</label>
          <select id="modal-practice" name="practice">
            <option value="">I'm not sure — help me choose</option>
            <option value="web">Web &amp; Commerce</option>
            <option value="product">Product Engineering</option>
            <option value="ai">AI Agents &amp; Automation</option>
            <option value="partnership">Ongoing Partnership</option>
          </select>
        </div>
        <div class="form-row">
          <label for="modal-budget">Budget band</label>
          <select id="modal-budget" name="budget">
            <option value="">Not sure yet</option>
            <option>Under $500</option>
            <option>$500 – $1,999</option>
            <option>$2,000 – $4,999</option>
            <option>$5,000 – $9,999</option>
            <option>$10,000+</option>
            <option>Retainer only</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <label for="modal-message">Tell us the problem</label>
        <textarea id="modal-message" name="message" placeholder="What's broken, what's missing, or what you want to ship." required></textarea>
      </div>

      <!-- Honeypot field (hidden from real users) -->
      <input type="text" name="website" style="display:none;" tabindex="-1" autocomplete="off" />

      <!-- Turnstile verification widget -->
      <div class="form-row" style="margin-bottom:0">
        <div class="cf-turnstile" data-sitekey="0x4AAAAAADFUxuYjCdOosg6z" data-theme="dark"></div>
      </div>

      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-top:16px">
        <button class="btn-primary" type="submit" style="border:0;cursor:pointer" id="submit-btn">Send intake</button>
        <span id="form-status" style="font-size:14px;color:#5b6e75;display:none;"></span>
        <a class="btn-ghost" href="mailto:labs@techadyant.com">Or email directly</a>
      </div>

      <p class="form-note">This form sends your message directly to our inbox. We'll reply within one business day. We don't sell, share or scrape your details — principle-led, not growth-hack-led.</p>
    </form>
  </div>
</div>
`;

// Initialize modal when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if modal already exists (in case it's hardcoded on the page)
  if (document.getElementById('contact-modal')) {
    initializeModal();
    return;
  }

  // Inject modal HTML into page
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = MODAL_HTML;
  document.body.appendChild(modalContainer.firstElementChild);

  // Initialize modal
  initializeModal();
});

function initializeModal() {
  const modal = document.getElementById('contact-modal');
  if (!modal) return;

  // Modal open/close handlers
  document.querySelectorAll('[data-open-modal="contact"]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      console.log('Modal opened');
    });
  });

  // Close button handler
  const closeBtn = modal.querySelector('[data-close-modal="true"]');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.remove('active');
      document.body.style.overflow = '';
      console.log('Modal closed via button');
    });
  }

  // Backdrop click handler
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      console.log('Modal closed via backdrop');
    }
  });

  // Form submission handler
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('submit-btn');
      const statusEl = document.getElementById('form-status');
      const originalBtnText = submitBtn.textContent;

      // Get Turnstile token
      const turnstileToken = window.turnstile?.getResponse();
      console.log('Turnstile token:', turnstileToken);

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        statusEl.style.display = 'none';

        // Collect form data
        const payload = {
          name: document.getElementById('modal-name').value,
          email: document.getElementById('modal-email').value,
          company: document.getElementById('modal-company').value,
          practice: document.getElementById('modal-practice').value || 'general',
          budget: document.getElementById('modal-budget').value,
          message: document.getElementById('modal-message').value,
          website: document.querySelector('input[name="website"]').value,
          turnstileToken: turnstileToken,
        };

        console.log('Form payload:', payload);

        // POST to /api/contact
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response data:', result);

        if (result.ok) {
          // Success
          submitBtn.textContent = '✓ Intake received!';
          submitBtn.style.backgroundColor = '#10b981';
          statusEl.textContent = 'Your intake form has been sent. We\'ll reply within one business day.';
          statusEl.style.color = '#10b981';
          statusEl.style.display = 'block';
          form.reset();
          window.turnstile?.reset?.();

          // Close modal after 3 seconds
          setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }, 3000);
        } else {
          // Error from backend
          throw new Error(result.error || 'Failed to send form');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        statusEl.textContent = '❌ ' + (error.message || 'Failed to send. Please try again or email us directly.');
        statusEl.style.color = '#dc2626';
        statusEl.style.display = 'block';
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        window.turnstile?.reset?.();
      }
    });
  }
