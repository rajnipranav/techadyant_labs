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

  /* ---- Global mailto fallback (copy to clipboard) ---- */
  ready(function(){
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href^="mailto:"]');
      if (link && navigator.clipboard && window.isSecureContext) {
        var href = link.getAttribute('href');
        var email = href.replace('mailto:', '').split('?')[0];
        
        // Save original HTML to restore it later
        var originalHTML = link.innerHTML;
        var originalWidth = link.offsetWidth; // Prevent button jumping if it's styled
        
        navigator.clipboard.writeText(email).then(function() {
          link.style.width = originalWidth ? originalWidth + 'px' : '';
          link.innerHTML = 'Copied to clipboard!';
          
          setTimeout(function() {
            link.innerHTML = originalHTML;
            link.style.width = '';
          }, 2000);
        }).catch(function(err) {
          console.log('Clipboard copy failed', err);
        });
        
        // We do NOT call e.preventDefault() here!
        // We still want the browser to try opening the default mail app.
        // But if it fails (because the user has no mail app), they at least
        // get the email copied to their clipboard with a visual confirmation!
      }
    });
  });

})();
