'use strict';

/** Jot marketing site — scroll reveals, nav, public DMG download */
(function () {
  const nav = document.getElementById('nav');
  const reveals = document.querySelectorAll('.reveal');
  const downloadBtn = document.getElementById('download-btn');
  const versionLabel = document.getElementById('version-label');

  const PUBLIC_RELEASES = 'https://github.com/parthha12/jot-releases/releases/latest';
  const RELEASES_API = 'https://api.github.com/repos/parthha12/jot-releases/releases/latest';

  async function wireDownloadButton() {
    if (!downloadBtn) return;
    downloadBtn.href = PUBLIC_RELEASES;
    downloadBtn.setAttribute('target', '_blank');
    downloadBtn.setAttribute('rel', 'noopener');

    try {
      const res = await fetch(RELEASES_API);
      if (!res.ok) throw new Error('release fetch failed');
      const release = await res.json();
      const dmg = (release.assets || []).find((a) => /\.dmg$/i.test(a.name || ''));
      if (dmg?.browser_download_url) {
        downloadBtn.href = dmg.browser_download_url;
      } else if (release.html_url) {
        downloadBtn.href = release.html_url;
      }
      if (versionLabel && release.tag_name) {
        versionLabel.textContent = `Jot ${String(release.tag_name).replace(/^v/, '')}`;
      }
    } catch {
      /* fallback href already set */
    }
  }

  void wireDownloadButton();

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

  document.querySelectorAll('[data-showcase]').forEach((slot) => {
    const img = slot.querySelector('img[data-filename]');
    if (!img) return;
    const filename = img.getAttribute('data-filename');
    const probe = new Image();
    probe.onload = () => {
      img.src = `assets/${filename}`;
      img.hidden = false;
      slot.classList.add('is-loaded');
    };
    probe.src = `assets/${filename}`;
  });

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
