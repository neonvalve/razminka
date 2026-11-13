const dialog = document.querySelector('#lightbox');
document.querySelectorAll('.screenshot').forEach(button => {
  button.addEventListener('click', () => {
    const source = button.querySelector('img');
    const image = dialog.querySelector('img');
    image.src = source.src;
    image.alt = source.alt;
    dialog.showModal();
  });
});
document.querySelector('#close-lightbox').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

fetch('https://api.github.com/repos/neonvalve/razminka-releases/releases/latest', { signal: AbortSignal.timeout(8000) })
  .then(response => { if (!response.ok) throw new Error('Release unavailable'); return response.json(); })
  .then(release => {
    if (release.draft || release.prerelease || !Array.isArray(release.assets)) return;
    for (const [id, suffix] of [['setup-link', '-Setup-x64.exe'], ['portable-link', '-Portable-x64.zip']]) {
      const asset = release.assets.find(item => item.name.startsWith('Razminka-') && item.name.endsWith(suffix));
      if (asset?.browser_download_url?.startsWith('https://github.com/neonvalve/razminka-releases/releases/download/')) {
        document.getElementById(id).href = asset.browser_download_url;
      }
    }
    document.querySelector('#version').textContent = `Версия ${release.tag_name}.`;
  }).catch(() => { /* Static links still open the latest GitHub release. */ });
