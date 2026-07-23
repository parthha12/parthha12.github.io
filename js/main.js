'use strict';

/** Wire public Reminders DMG download from jot-releases. */
(function () {
  const downloadBtn = document.getElementById('download-btn');
  const versionLabel = document.getElementById('version-label');
  if (!downloadBtn) return;

  const PUBLIC_RELEASES = 'https://github.com/parthha12/jot-releases/releases/latest';
  const RELEASES_API = 'https://api.github.com/repos/parthha12/jot-releases/releases/latest';

  downloadBtn.href = PUBLIC_RELEASES;

  fetch(RELEASES_API)
    .then((res) => {
      if (!res.ok) throw new Error('release fetch failed');
      return res.json();
    })
    .then((release) => {
      const dmg = (release.assets || []).find((a) => /\.dmg$/i.test(a.name || ''));
      if (dmg?.browser_download_url) {
        downloadBtn.href = dmg.browser_download_url;
      } else if (release.html_url) {
        downloadBtn.href = release.html_url;
      }
      if (versionLabel && release.tag_name) {
        versionLabel.textContent = `J.O.T. Reminders ${String(release.tag_name).replace(/^v/, '')}`;
      }
    })
    .catch(() => {
      /* fallback href already set */
    });
})();
