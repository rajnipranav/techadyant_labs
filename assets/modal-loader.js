/* ========================================================================
   TechAdyant Labs — Modal Loader
   Handles the contact modal: opens/closes on button clicks,
   injects modal HTML if not already in the page, and wires up
   the Turnstile CAPTCHA widget without double-rendering.
   ======================================================================== */

(function () {
  'use strict';

  var TURNSTILE_SITEKEY = '0x4AAAAAADFUxuYjCdOosg6z';

  /* ---- Modal HTML (injected only when no static #contact-modal exists) ---- */
  var MODAL_HTML = [
    '<div id="contact-modal">',
    '  <div class="modal-content">',
    '    <div class="modal-header">',
    '      <h2 class="modal-title">Quick intake form</h2>',
    '      <button class="modal-close" type="button">&#x2715;</button>',
    '    </div>',
    '    <p class="modal-description">',
    '      Tell us the problem. The inputs (data, systems, approvals).',
    '      The smallest shape that could solve it. We will be in touch within one business day.',
    '    </p>',
    '    <form class="contact-form" id="contact-form">',
    '      <div class="form-row-split">',
    '        <div class="form-row">',
    '          <label for="modal-name">Your name</label>',
    '          <input id="modal-name" name="name" type="text" required />',
    '        </div>',
    '        <div class="form-row">',
    '          <label for="modal-email">Email</label>',
    '          <input id="modal-email" name="email" type="email" required />',
    '        </div>',
    '      </div>',
    '      <div class="form-row">',
    '        <label for="modal-company">Company / project</label>',
    '        <input id="modal-company" name="company" type="text" />',
    '      </div>',
    '      <div class="form-row-split">',
    '        <div class="form-row">',
    '          <label for="modal-practice">Which practice fits?</label>',
    '          <select id="modal-practice" name="practice">',
    '            <option value="">Help me choose</option>',
    '            <option value="web">Web &amp; Commerce</option>',
    '            <option value="product">Product Engineering</option>',
    '            <option value="ai">AI Agents &amp; Automation</option>',
    '            <option value="partnership">Ongoing Partnership</option>',
    '          </select>',
    '        </div>',
    '        <div class="form-row">',
    '          <label for="modal-budget">Budget band</label>',
    '          <select id="modal-budget" name="budget">',
    '            <option value="">Not sure yet</option>',
    '            <option>Under $500</option>',
    '            <option>$500 – $1,999</option>',
    '            <option>$2,000 – $4,999</option>',
    '            <option>$5,000 – $9,999</option>',
    '            <option>$10,000+</option>',
    '            <option>Retainer only</option>',
    '          </select>',
    '        </div>',
    '      </div>',
    '      <div class="form-row">',
    '        <label for="modal-message">Tell us the problem</label>',
    '        <textarea id="modal-message" name="message"',
    '          placeholder="What\'s broken, what\'s missing, or what you want to ship."',
    '          required></textarea>',
    '      </div>',
    '      <!-- Honeypot -->',
    '      <input type="text" name="website" style="display:none;" tabindex="-1" autocomplete="off" />',
    '      <!-- Turnstile: rendered explicitly by this script, not auto-rendered -->',
    '      <div class="form-row" style="margin-bottom:0">',
    '        <div id="modal-turnstile-container"></div>',
    '      </div>',
    '      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-top:16px">',
    '        <button class="btn-primary" type="submit" style="border:0;cursor:pointer" id="submit-btn">Send intake</button>',
    '        <span id="form-status" style="font-size:14px;color:#5b6e75;display:none;"></span>',
    '        <a class="btn-ghost" href="mailto:labs@techadyant.com">Or email directly</a>',
    '      </div>',
    '      <p class="form-note">This form sends your message directly to our inbox. We reply within one business day.</p>',
    '    </form>',
    '  </div>',
    '</div>'
  ].join('\n');

  /* ---- Ensure Turnstile script is loaded (once, globally) ---- */
  function ensureTurnstileScript(callback) {
    // If the API is already loaded, fire callback immediately
    if (window.turnstile && typeof window.turnstile.render === 'function') {
      callback();
      return;
    }
    // If the script tag already exists, wait for it to finish
    if (document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
      var interval = setInterval(function () {
        if (window.turnstile && typeof window.turnstile.render === 'function') {
          clearInterval(interval);
          callback();
        }
      }, 100);
      return;
    }
    // Load the script in explicit render mode so we control when widgets appear
    var script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.head.appendChild(script);
  }

  /* ---- Render Turnstile into the modal (explicit mode, no duplicates) ---- */
  var turnstileWidgetId = null;

  function renderTurnstile() {
    var container = document.getElementById('modal-turnstile-container');
    if (!container) return; // static modal pages don't use this container — no Turnstile needed there
    // Guard: already rendered
    if (turnstileWidgetId !== null) return;

    ensureTurnstileScript(function () {
      if (!window.turnstile) return;
      try {
        turnstileWidgetId = window.turnstile.render(container, {
          sitekey: TURNSTILE_SITEKEY,
          theme: 'dark'
        });
      } catch (e) {
        // Silently ignore if widget can't render (e.g. domain not whitelisted in dev)
        console.warn('[modal] Turnstile render skipped:', e.message);
      }
    });
  }

  /* ---- Open / close helpers ---- */
  function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Lazily render Turnstile the first time the modal opens
    renderTurnstile();
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ---- Wire up all event listeners ---- */
  function setupModalEventListeners() {
    var modal = document.getElementById('contact-modal');
    if (!modal) return;

    // Open buttons
    var openButtons = document.querySelectorAll('[data-open-modal="contact"]');
    openButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(modal);
      });
    });

    // Close button inside modal
    var closeBtn = modal.querySelector('.modal-close, [data-close-modal]');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeModal(modal);
      });
    }

    // Click on backdrop
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal(modal);
    });

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(modal);
    });

    // Form submit (only for dynamically-injected modal which has id="contact-form")
    var form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        handleFormSubmit(form, modal);
      });
    }
  }

  /* ---- Form submission ---- */
  function handleFormSubmit(form, modal) {
    var submitBtn = document.getElementById('submit-btn');
    var statusEl = document.getElementById('form-status');
    if (!submitBtn || !statusEl) return;

    var originalText = submitBtn.textContent;

    var turnstileToken = null;
    if (window.turnstile && typeof window.turnstile.getResponse === 'function') {
      turnstileToken = window.turnstile.getResponse(turnstileWidgetId || undefined);
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    statusEl.style.display = 'none';

    var honeypot = form.querySelector('input[name="website"]');
    var payload = {
      name:           (document.getElementById('modal-name')    || {}).value || '',
      email:          (document.getElementById('modal-email')   || {}).value || '',
      company:        (document.getElementById('modal-company') || {}).value || '',
      practice:       (document.getElementById('modal-practice')|| {}).value || 'general',
      budget:         (document.getElementById('modal-budget')  || {}).value || '',
      message:        (document.getElementById('modal-message') || {}).value || '',
      website:        honeypot ? honeypot.value : '',
      turnstileToken: turnstileToken
    };

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (result.ok) {
          submitBtn.textContent = 'Intake received!';
          submitBtn.style.backgroundColor = '#10b981';
          statusEl.textContent = 'Your intake form has been sent. We will reply within one business day.';
          statusEl.style.color = '#10b981';
          statusEl.style.display = 'block';
          form.reset();
          if (window.turnstile && typeof window.turnstile.reset === 'function') {
            window.turnstile.reset(turnstileWidgetId || undefined);
          }
          setTimeout(function () {
            closeModal(modal);
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
          }, 3000);
        } else {
          throw new Error(result.error || 'Failed to send form');
        }
      })
      .catch(function (err) {
        statusEl.textContent = 'Error: ' + (err.message || 'Failed to send. Please email us directly.');
        statusEl.style.color = '#dc2626';
        statusEl.style.display = 'block';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        if (window.turnstile && typeof window.turnstile.reset === 'function') {
          window.turnstile.reset(turnstileWidgetId || undefined);
        }
      });
  }

  /* ---- Init ---- */
  function initModalLoader() {
    // If the page already has a static #contact-modal baked into the HTML,
    // just wire up listeners — do NOT inject a second modal and do NOT try
    // to render Turnstile (the static modals don't include a Turnstile container).
    if (document.getElementById('contact-modal')) {
      setupModalEventListeners();
      return;
    }

    // Otherwise inject the dynamic modal (with Turnstile container)
    var wrapper = document.createElement('div');
    wrapper.innerHTML = MODAL_HTML;
    document.body.appendChild(wrapper.firstElementChild);
    setupModalEventListeners();
    // Turnstile will be lazily rendered on first modal open (see openModal)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModalLoader);
  } else {
    initModalLoader();
  }

})();
