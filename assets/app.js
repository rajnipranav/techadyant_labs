/* ========================================================================
   TechPavitra Labs — shared scripts
   Particle canvas animation + small UX niceties.
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
    // Previously targeted non-existent class names — fixed here.
    initParticles('#bg');
  });

  /* ---- Contact form — client-side only, mailto fallback ---- */
  ready(function(){
    const form = document.querySelector('form.contact-form');
    if (!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').trim();
      const email = (data.get('email') || '').trim();
      const company = (data.get('company') || '').trim();
      const practice = data.get('practice') || 'Not specified';
      const budget = data.get('budget') || 'Not specified';
      const message = (data.get('message') || '').trim();
      const subject = encodeURIComponent('Intake — ' + practice + (company ? ' — ' + company : ''));
      const body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Company: ' + company + '\n' +
        'Practice: ' + practice + '\n' +
        'Budget band: ' + budget + '\n\n' +
        'Message:\n' + message
      );
      // Show inline success state before opening email client
      const submitBtn = form.querySelector('button[type="submit"]');
      const successId = 'form-success-msg';
      if (!document.getElementById(successId)) {
        const msg = document.createElement('div');
        msg.id = successId;
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
          '<span><strong>Message sent.</strong> Your email client will open (or may have already). ' +
          'If nothing happened, email us directly at <a href="mailto:labs@techpavitra.com" ' +
          'style="color:#34D399;text-decoration:underline">labs@techpavitra.com</a>. ' +
          'We reply within one business day.</span>';
        if (submitBtn && submitBtn.parentNode) {
          submitBtn.parentNode.insertBefore(msg, submitBtn.nextSibling);
        } else {
          form.appendChild(msg);
        }
      }
      window.location.href = 'mailto:labs@techpavitra.com?subject=' + subject + '&body=' + body;
    });
  });

})();
