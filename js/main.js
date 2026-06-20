'use strict';

/** Jot marketing site — scroll reveals, nav (private repo; no public release API) */
(function () {
  const nav = document.getElementById('nav');
  const reveals = document.querySelectorAll('.reveal');
  const downloadBtn = document.getElementById('download-btn');

  // Public DMG downloads — source repo stays private
  const PUBLIC_RELEASES = 'https://github.com/parthha12/jot-releases/releases/latest';
  if (downloadBtn) {
    downloadBtn.href = PUBLIC_RELEASES;
    downloadBtn.setAttribute('target', '_blank');
    downloadBtn.setAttribute('rel', 'noopener');
  }

  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));

  document.querySelectorAll('.letter[data-persona]').forEach((letter) => {
    letter.addEventListener('click', () => {
      const id = letter.dataset.persona;
      const card = document.querySelector(`.crew-card[data-persona="${id}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.transition = 'box-shadow 0.3s';
        card.style.boxShadow = '0 0 0 2px rgba(196, 161, 255, 0.5)';
        setTimeout(() => {
          card.style.boxShadow = '';
        }, 1200);
      }
    });
    letter.style.cursor = 'pointer';
  });
})();
