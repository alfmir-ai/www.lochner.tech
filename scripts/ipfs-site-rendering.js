const fs = require('fs');
const path = require('path');
const { createSharedFooterTemplate } = require('./ipfs-verification-footer');

const COPYRIGHT_YEAR = new Date().getFullYear();

const HTML_FILES = [
  'index.html',
  'alfmir.ai.html',
  'lochner-apparel.html',
  // 'lochner-soaps.html',
  '50x.html',
];
const STATIC_DIRS = ['assets', 'images'];
const STATIC_FILES = ['alfe_favicon_64x64.ico'];

const IPFS_SHARED_HEADER_TEMPLATE = `
  <header class="site-header">
    <h1><a class="site-title-link" href="index.html">Lochner Technology</a></h1>
    <p>Lochner Technology builds developer software and AI-assisted workflow tools.</p>
    <div class="cta-buttons">
      <a class="cta-button" href="https://lemmy.lochner.tech/" target="_blank" rel="noopener" title="Open Lemmy community">
        <span class="cta-button-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M21.327 8.566c0-4.339-2.843-5.61-2.843-5.61-1.433-.658-3.894-.935-6.451-.956h-.063c-2.557.021-5.016.298-6.45.956 0 0-2.843 1.272-2.843 5.61 0 .993-.019 2.181.012 3.441.103 4.243.778 8.425 4.701 9.463 1.809.479 3.362.579 4.612.51 2.268-.126 3.541-.809 3.541-.809l-.075-1.646s-1.621.511-3.441.449c-1.804-.062-3.707-.194-3.999-2.409a4.523 4.523 0 0 1-.04-.621s1.77.433 4.014.536c1.372.063 2.658-.08 3.965-.236 2.506-.299 4.688-1.843 4.962-3.254.434-2.223.398-5.424.398-5.424zm-3.353 5.59h-2.081V9.057c0-1.075-.452-1.62-1.357-1.62-1 0-1.501.647-1.501 1.927v2.791h-2.069V9.364c0-1.28-.501-1.927-1.502-1.927-.905 0-1.357.546-1.357 1.62v5.099H6.026V8.903c0-1.074.273-1.927.823-2.558.566-.631 1.307-.955 2.228-.955 1.065 0 1.872.409 2.405 1.228l.518.869.519-.869c.533-.819 1.34-1.228 2.405-1.228.92 0 1.662.324 2.228.955.549.631.822 1.484.822 2.558v5.253z"></path>
          </svg>
        </span>
        Lemmy / Mastodon
      </a>
      <details class="cta-dropdown">
        <summary class="cta-button" title="Open Bluesky profiles">
          <span class="cta-button-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M12 10.8c-1.09-2.11-4.05-6.05-6.8-8C2.57.95 1.56 1.27.9 1.57.14 1.9 0 3.03 0 3.69c0 .65.36 5.36.6 6.15.78 2.61 3.55 3.49 6.1 3.21-4.44.66-8.38 2.28-3.21 8.03 5.69 5.9 7.8-1.27 8.51-4.89.71 3.62 2.25 10.53 8.41 4.89 4.63-4.89 1.27-7.37-3.11-8.03 2.55.28 5.32-.6 6.1-3.21.24-.79.6-5.5.6-6.15 0-.66-.14-1.79-.9-2.12-.66-.3-1.67-.62-4.3 1.24-2.75 1.94-5.71 5.88-6.8 7.99Z"></path>
            </svg>
          </span>
          Bluesky
        </summary>
        <div class="cta-dropdown-menu">
          <button class="cta-dropdown-header" type="button" aria-expanded="false" aria-describedby="bluesky-account-tip">
            <span class="cta-button-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 10.8c-1.09-2.11-4.05-6.05-6.8-8C2.57.95 1.56 1.27.9 1.57.14 1.9 0 3.03 0 3.69c0 .65.36 5.36.6 6.15.78 2.61 3.55 3.49 6.1 3.21-4.44.66-8.38 2.28-3.21 8.03 5.69 5.9 7.8-1.27 8.51-4.89.71 3.62 2.25 10.53 8.41 4.89 4.63-4.89 1.27-7.37-3.11-8.03 2.55.28 5.32-.6 6.1-3.21.24-.79.6-5.5.6-6.15 0-.66-.14-1.79-.9-2.12-.66-.3-1.67-.62-4.3 1.24-2.75 1.94-5.71 5.88-6.8 7.99Z"></path>
              </svg>
            </span>
            Bluesky
          </button>
          <span class="cta-dropdown-tooltip" id="bluesky-account-tip" role="tooltip" hidden>Click one of the Bluesky accounts below.</span>
          <a href="https://bsky.app/profile/news.lochner.tech" target="_blank" rel="noopener">Lochner Tech News</a>
          <a href="https://bsky.app/profile/alfmir-ai.bsky.social" target="_blank" rel="noopener">Alfmir.ai</a>
          <!-- <a href="https://bsky.app/profile/lochner-apparel.bsky.social" target="_blank" rel="noopener">Lochner Apparel</a> -->
        </div>
      </details>
      <a class="cta-button" href="https://github.com/alfmir-ai" target="_blank" rel="noopener" title="Open GitHub profile">
        <span class="cta-button-icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" focusable="false">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.49 7.49 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"></path>
          </svg>
        </span>
        GitHub
      </a>
      <a class="cta-button" href="https://www.npmjs.com/~lochner-lw" target="_blank" rel="noopener" title="Open npm profile">
        NPM
      </a>
      <a class="cta-button" href="https://www.linkedin.com/in/nicholelochner/" target="_blank" rel="noopener" title="Open LinkedIn profile">
        LinkedIn
      </a>
    </div>
  </header>
  <script>
    (() => {
      const header = document.querySelector('.cta-dropdown-header');
      const tooltip = document.querySelector('.cta-dropdown-tooltip');
      const dropdown = header?.closest('.cta-dropdown');

      if (!header || !tooltip || !dropdown) return;

      const hideTooltip = () => {
        tooltip.hidden = true;
        header.setAttribute('aria-expanded', 'false');
      };

      header.addEventListener('click', (event) => {
        event.stopPropagation();
        const willOpen = tooltip.hidden;
        tooltip.hidden = !willOpen;
        header.setAttribute('aria-expanded', String(willOpen));
      });
      dropdown.addEventListener('toggle', () => {
        if (!dropdown.open) hideTooltip();
      });
      document.addEventListener('click', hideTooltip);
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') hideTooltip();
      });
    })();
  </script>
`;

function isHtmlFile(relativePath) {
  return HTML_FILES.includes(relativePath);
}

function prepareHtmlForIpfs(html, options = {}) {
  const footerTemplate = createSharedFooterTemplate(COPYRIGHT_YEAR, options);
  return html
    .replace('<!-- SHARED_HEADER -->', IPFS_SHARED_HEADER_TEMPLATE)
    .replace('<!-- SHARED_FOOTER -->', footerTemplate)
    .replaceAll('href="/alfe_favicon_64x64.ico"', 'href="alfe_favicon_64x64.ico"')
    .replaceAll('url("/assets/', 'url("assets/')
    .replaceAll("url('/assets/", "url('assets/")
    .replaceAll('url(/assets/', 'url(assets/');
}

function readIpfsPublishedFile(rootDir, relativePath, options = {}) {
  const absolutePath = path.join(rootDir, relativePath);
  const data = fs.readFileSync(absolutePath);

  return isHtmlFile(relativePath)
    ? Buffer.from(prepareHtmlForIpfs(data.toString('utf8'), options), 'utf8')
    : data;
}

module.exports = {
  HTML_FILES,
  STATIC_DIRS,
  STATIC_FILES,
  prepareHtmlForIpfs,
  readIpfsPublishedFile,
};
