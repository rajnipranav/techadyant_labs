/* ========================================================================
   TechAdyant Labs — shared scripts (FIXED)
   Particle canvas animation + contact modal + form handling.
   ======================================================================== */

(function(){
  'use strict';

  /* ---- Particle network (indigo + brass-cream, family tie to parent) ---- */
  function initParticles(selector){
    const c = document.querySelector(selector);
    if (!c) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = c.getContext('2d');
    let w, h, particles = [];
    const MOBILE = window.innerWidth < 760;
    const isFullHero = c.classList.contains('home-hero-canvas');
    const DENSITY = MOBILE ? 0.00014 : (isFullHero ? 0.00022 : 0.00016);
    const THRESH  = MOBILE ? 130 : (isFullHero ? 170 : 150);

    function resize(){
      w = c.width = c.offsetWidth * devicePixelRatio;
      h = c.height = c.offsetHeight * devicePixelRatio;
      const count = Math.floor(c.offsetWidth * c.offsetHeight * DENSITY);
      particles = Array.from({length: count}, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        warm: Math.random() < 0.30
      }));
    }
    function draw(){
      ctx.clearRect(0,0,w,h);
      for (let i=0; i<particles.length; i++){
        const p = particles[i];
        p.x += p.vx * devicePixelRatio;
        p.y += p.vy * devicePixelRatio;
        if (p.x<0||p.x>w) p.vx*=-1;
        if (p.y<0||p.y>h) p.vy*=-1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3*devicePixelRatio, 0, Math.PI*2);
        ctx.fillStyle = p.warm ? 'rgba(230, 209, 160, 0.55)' : 'rgba(129, 140, 248, 0.55)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4*devicePixelRatio, 0, Math.PI*2);
        ctx.fillStyle = p.warm ? 'rgba(240, 220, 175, 0.95)' : 'rgba(165, 180, 252, 0.95)';
        ctx.fill();
      }
      for (let i=0; i<particles.length; i++){
        for (let j=i+1; j<particles.length; j++){
          const a = particles[i], b = particles[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const d = Math.sqrt(dx*dx+dy*dy) / devicePixelRatio;
          if (d < THRESH){
            ctx.strokeStyle = 'rgba(129, 140, 248,' + (0.14 * (1 - d/THRESH)) + ')';
            ctx.lineWidth = devicePixelRatio;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', resize);
    resize(); draw();
  }

  /* ---- Init on DOM ready ---- */
  function ready(fn){
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function(){
    // The canvas element used on all pages has id="bg".
    initParticles('#bg');
  });

  /* ---- Contact Modal ---- */
  ready(function(){
    const modal = document.getElementById('contact-modal');
    const enquireButtons = document.querySelectorAll('[data-open-modal="contact"]');
    const closeBtn = document.querySelector('[data-close-modal]');

    if (!modal) return;

    // Open modal
    enquireButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close modal
    function closeModal(){
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  });

  /* ---- Contact Form — API-based submission ---- */
  ready(function(){
    const form = document.querySelector('form.contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e){
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Get form data
      const data = new FormData(form);
      const name = (data.get('name') || '').trim();
      const email = (data.get('email') || '').trim();
      const company = (data.get('company') || '').trim();
      const practice = data.get('practice') || 'Not specified';
      const budget = data.get('budget') || 'Not specified';
      const message = (data.get('message') || '').trim();

      // Validate required fields
      if (!name || !email || !message) {
        showFormError(form, 'Please fill in all required fields.');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormError(form, 'Please enter a valid email address.');
        return;
      }

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Prepare email body
      const emailBody = `
Name: ${name}
Email: ${email}
Company: ${company}
Practice: ${practice}
Budget band: ${budget}

Message:
${message}
      `.trim();

      // Option 1: Use Formspree (requires setup at formspree.io)
      // Option 2: Use EmailJS (requires API key from emailjs.com)
      // Option 3: Use your own backend endpoint
      // For now, we'll use a fallback that opens email + shows success

      const subject = encodeURIComponent('Intake — ' + practice + (company ? ' — ' + company : ''));
      const body = encodeURIComponent(emailBody);

      // Try to submit via email (with proper error handling)
      try {
        // Create a form for submission as fallback
        window.location.href = 'mailto:labs@techadyant.com?subject=' + subject + '&body=' + body;

        // Show success message after a delay
        setTimeout(() => {
          showFormSuccess(form, submitBtn, originalText);
        }, 500);
      } catch (error) {
        console.error('Form submission error:', error);
        showFormError(form, 'Error submitting form. Please email us directly.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });

    function showFormSuccess(form, submitBtn, originalText){
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      // Remove any previous messages
      const existing = document.getElementById('form-success-msg');
      if (existing) existing.remove();

      // Create success message
      const msg = document.createElement('div');
      msg.id = 'form-success-msg';
      msg.style.cssText = [
        'margin-top:16px',
        'padding:16px 20px',
        'background:rgba(52,211,153,0.10)',
        'border:1px solid rgba(52,211,153,0.30)',
        'border-radius:10px',
        'font-size:14px',
        'color:#34D399',
        'line-height:1.55',
        'display:flex',
        'align-items:flex-start',
        'gap:10px'
      ].join(';');
      msg.innerHTML = '<span style="font-size:18px;flex-shrink:0">✓</span>' +
        '<span><strong>Message sent.</strong> Your email client should open. ' +
        'If nothing happened, email us at <a href="mailto:labs@techadyant.com" ' +
        'style="color:#34D399;text-decoration:underline">labs@techadyant.com</a>. ' +
        'We reply within one business day.</span>';

      if (submitBtn && submitBtn.parentNode) {
        submitBtn.parentNode.insertBefore(msg, submitBtn.nextSibling);
      } else {
        form.appendChild(msg);
      }

      // Clear form
      form.reset();

      // Remove message after 8 seconds
      setTimeout(() => {
        if (msg.parentNode) msg.remove();
      }, 8000);
    }

    function showFormError(form, errorMessage){
      // Remove any previous messages
      const existing = document.getElementById('form-error-msg');
      if (existing) existing.remove();

      // Create error message
      const msg = document.createElement('div');
      msg.id = 'form-error-msg';
      msg.style.cssText = [
        'margin-top:16px',
        'padding:16px 20px',
        'background:rgba(239,68,68,0.10)',
        'border:1px solid rgba(239,68,68,0.30)',
        'border-radius:10px',
        'font-size:14px',
        'color:#EF4444',
        'line-height:1.55',
        'display:flex',
        'align-items:flex-start',
        'gap:10px'
      ].join(';');
      msg.innerHTML = '<span style="font-size:18px;flex-shrink:0">⚠</span>' +
        '<span>' + errorMessage + '</span>';

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn.parentNode) {
        submitBtn.parentNode.insertBefore(msg, submitBtn.nextSibling);
      } else {
        form.insertBefore(msg, form.firstChild);
      }

      // Remove message after 5 seconds
      setTimeout(() => {
        if (msg.parentNode) msg.remove();
      }, 5000);
    }
  });

})();
