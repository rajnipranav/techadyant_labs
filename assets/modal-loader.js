/**
 * Shared Contact Modal Loader
 */

const MODAL_HTML = `
<div id="contact-modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">Quick intake form</h2>
      <button class="modal-close" data-close-modal="true" type="button">X</button>
    </div>
    <p class="modal-description">
      Tell us the problem. The inputs (data, systems, approvals). The smallest shape that could solve it. We will be in touch within one business day.
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
            <option value="">Help me choose</option>
            <option value="web">Web and Commerce</option>
            <option value="product">Product Engineering</option>
            <option value="ai">AI Agents and Automation</option>
            <option value="partnership">Ongoing Partnership</option>
          </select>
        </div>
        <div class="form-row">
          <label for="modal-budget">Budget band</label>
          <select id="modal-budget" name="budget">
            <option value="">Not sure yet</option>
            <option>Under 500</option>
            <option>500 to 1999</option>
            <option>2000 to 4999</option>
            <option>5000 to 9999</option>
            <option>10000 or more</option>
            <option>Retainer only</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <label for="modal-message">Tell us the problem</label>
        <textarea id="modal-message" name="message" placeholder="What is broken, what is missing, or what you want to ship." required></textarea>
      </div>
      <input type="text" name="website" style="display:none;" tabindex="-1" autocomplete="off" />
      <div class="form-row" style="margin-bottom:0">
        <div class="cf-turnstile" data-sitekey="0x4AAAAAADFUxuYjCdOosg6z" data-theme="dark"></div>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-top:16px">
        <button class="btn-primary" type="submit" style="border:0;cursor:pointer" id="submit-btn">Send intake</button>
        <span id="form-status" style="font-size:14px;color:#5b6e75;display:none;"></span>
        <a class="btn-ghost" href="mailto:labs@techadyant.com">Or email directly</a>
      </div>
      <p class="form-note">This form sends your message directly to our inbox. We will reply within one business day.</p>
    </form>
  </div>
</div>
`;

document.addEventListener("DOMContentLoaded", function() {
  if (document.getElementById("contact-modal")) {
    initializeModal();
    return;
  }

  const modalContainer = document.createElement("div");
  modalContainer.innerHTML = MODAL_HTML;
  document.body.appendChild(modalContainer.firstElementChild);

  if (window.turnstile) {
    const turnstileContainer = document.querySelector('.cf-turnstile');
    if (turnstileContainer) {
      window.turnstile.render(turnstileContainer);
    }
  }

  initializeModal();
});

function initializeModal() {
  const modal = document.getElementById("contact-modal");
  if (!modal) return;

  document.querySelectorAll('[data-open-modal="contact"]').forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  const closeBtn = modal.querySelector('[data-close-modal="true"]');
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById("submit-btn");
      const statusEl = document.getElementById("form-status");
      const originalBtnText = submitBtn.textContent;
      const turnstileToken = window.turnstile ? window.turnstile.getResponse() : null;

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        statusEl.style.display = "none";

        const payload = {
          name: document.getElementById("modal-name").value,
          email: document.getElementById("modal-email").value,
          company: document.getElementById("modal-company").value,
          practice: document.getElementById("modal-practice").value || "general",
          budget: document.getElementById("modal-budget").value,
          message: document.getElementById("modal-message").value,
          website: document.querySelector('input[name="website"]').value,
          turnstileToken: turnstileToken
        };

        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.ok) {
          submitBtn.textContent = "X Intake received!";
          submitBtn.style.backgroundColor = "#10b981";
          statusEl.textContent = "Your intake form has been sent. We will reply within one business day.";
          statusEl.style.color = "#10b981";
          statusEl.style.display = "block";
          form.reset();
          if (window.turnstile) window.turnstile.reset();

          setTimeout(() => {
            modal.classList.remove("active");
            document.body.style.overflow = "";
          }, 3000);
        } else {
          throw new Error(result.error || "Failed to send form");
        }
      } catch (error) {
        statusEl.textContent = "Error: " + (error.message || "Failed to send. Please try again or email us directly.");
        statusEl.style.color = "#dc2626";
        statusEl.style.display = "block";
        submitBtn.textContent = ori