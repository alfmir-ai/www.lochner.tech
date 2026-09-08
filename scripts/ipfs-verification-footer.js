const GITHUB_RAW_MANIFEST_URL = 'https://raw.githubusercontent.com/nicholelochner/lochner.tech_apparel/main/ipfs-version.json';
const GITHUB_MAIN_COMMIT_API_URL = 'https://api.github.com/repos/nicholelochner/lochner.tech_apparel/commits/main';
const MANIFEST_PATH = 'ipfs-version.json';
const DOMAIN_NAME = 'lochner.tech';
const IPNS_ID = 'k2k4r8jw4dtnalpkgklrqeflhsgderg6a8wn5lix7bww1yjemm0rx7ye';
const DWEB_IPNS_URL = `https://${IPNS_ID}.ipns.dweb.link/`;
const PUBLIC_GATEWAY_CHECKER_URL = 'https://ipfs.github.io/public-gateway-checker/';
const VERIFICATION_NOT_BEFORE_PATH = 'ipfs-verification-not-before.txt';

const PUBLIC_IPFS_GATEWAYS = [
  { label: 'ipfs.io', siteUrl: `https://ipfs.io/ipns/${IPNS_ID}/` },
  { label: 'dweb.link', siteUrl: DWEB_IPNS_URL },
  { label: 'ipfs.filebase.io', siteUrl: `https://ipfs.filebase.io/ipns/${IPNS_ID}/` },
  { label: 'dget.top', siteUrl: `https://dget.top/ipns/${IPNS_ID}/` },
];

function createSharedFooterTemplate(copyrightYear, options = {}) {
  const includeGithub = options.includeGithub === true;
  const verificationTitle = includeGithub
    ? 'IPFS/Git version verification'
    : 'IPFS version verification';
  const publicGatewayLinks = PUBLIC_IPFS_GATEWAYS
    .map((gateway) => `<a href="${gateway.siteUrl}" target="_blank" rel="noopener">${gateway.label}</a>`)
    .join(' ·\n        ');
  const publicGatewayManifestEntries = JSON.stringify(
    PUBLIC_IPFS_GATEWAYS.map((gateway) => ({
      label: gateway.label,
      siteUrl: gateway.siteUrl,
      manifestUrl: gateway.siteUrl + MANIFEST_PATH,
    }))
  );

  return `
  <footer class="site-footer site-footer-with-verification">
    <style>
      .site-footer-with-verification {
        text-align: center;
        color: #9aa4ba;
        padding: 0 1.5rem 2rem;
      }

      .site-footer-with-verification small {
        display: block;
      }

      .ipfs-footer-verification {
        max-width: 1100px;
        margin: 1rem auto 0;
        padding: 0.85rem 1rem;
        border: 1px solid rgba(56, 189, 248, 0.28);
        border-radius: 12px;
        background: linear-gradient(180deg, rgba(14, 165, 233, 0.1), rgba(255, 255, 255, 0.035));
        color: #dbeafe;
        text-align: left;
      }

      .ipfs-footer-verification:not([open]) {
        display: inline-block;
        width: auto;
        max-width: 100%;
        padding: 0.55rem 0.75rem;
      }

      .ipfs-footer-verification-header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.6rem;
        justify-content: space-between;
      }

      .ipfs-footer-verification-title {
        margin: 0;
        color: #e0f2fe;
        font-size: 0.95rem;
        font-weight: 800;
      }

      .ipfs-footer-verification-summary {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.6rem;
        justify-content: space-between;
        list-style: none;
        cursor: pointer;
      }

      .ipfs-footer-verification:not([open]) .ipfs-footer-verification-summary {
        flex-wrap: nowrap;
      }

      .ipfs-footer-verification-summary::-webkit-details-marker {
        display: none;
      }

      .ipfs-footer-verification-summary:focus-visible {
        border-radius: 10px;
        outline: 2px solid rgba(147, 197, 253, 0.75);
        outline-offset: 4px;
      }

      .ipfs-footer-verification {
        --ipfs-footer-reddit-orange: #ff5700;
      }

      .ipfs-footer-summary-status {
        margin-left: auto;
        color: #e2e8f0;
        font-size: 0.9rem;
        font-weight: 800;
        letter-spacing: 0.025em;
        text-rendering: geometricPrecision;
      }

      .ipfs-footer-summary-status[data-state=verified] {
        color: #22c55e;
      }

      .ipfs-footer-summary-status[data-state=warning],
      .ipfs-footer-summary-status[data-state=error] {
        color: var(--ipfs-footer-reddit-orange);
      }

      .ipfs-footer-verification[open] .ipfs-footer-summary-status {
        display: none;
      }

      .ipfs-footer-summary-info-icon {
        display: inline-grid;
        place-items: center;
        width: 1.25rem;
        height: 1.25rem;
        flex: 0 0 auto;
        border: 1px solid currentColor;
        border-radius: 999px;
        color: #bfdbfe;
        font-size: 0.78rem;
        font-weight: 900;
        line-height: 1;
      }

      .ipfs-footer-verification[open] .ipfs-footer-summary-info-icon {
        display: none;
      }

      .ipfs-footer-verification-heading {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        min-width: min(100%, 18rem);
      }

      .ipfs-footer-verification:not([open]) .ipfs-footer-verification-heading {
        min-width: 0;
      }

      .ipfs-footer-verification:not([open]) .ipfs-footer-verification-title {
        white-space: nowrap;
      }

      .ipfs-footer-shield {
        position: relative;
        display: inline-grid;
        place-items: center;
        width: 2.65rem;
        height: 2.65rem;
        flex: 0 0 auto;
        color: #93c5fd;
        font-size: 2.45rem;
        line-height: 1;
        filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.42));
      }

      .ipfs-footer-verification:not([open]) .ipfs-footer-shield {
        width: 2.35rem;
        height: 2.35rem;
        font-size: 2.2rem;
      }

      .ipfs-footer-shield-mark {
        position: absolute;
        display: inline-grid;
        place-items: center;
        width: 0.86rem;
        height: 0.86rem;
        border-radius: 999px;
        color: #0f172a;
        font-size: 0.74rem;
        font-weight: 1000;
        line-height: 1;
        opacity: 0;
        transform: translateY(0.02rem);
      }

      .ipfs-footer-verification[data-state=loading] .ipfs-footer-shield-mark {
        border: 2px solid rgba(191, 219, 254, 0.35);
        border-top-color: #e0f2fe;
        opacity: 1;
        animation: ipfs-footer-shield-spin 0.8s linear infinite;
      }

      .ipfs-footer-verification[data-state=verified] .ipfs-footer-shield-mark {
        background: #22c55e;
        color: #052e16;
        opacity: 1;
      }

      .ipfs-footer-verification[data-state=warning] .ipfs-footer-shield-mark,
      .ipfs-footer-verification[data-state=error] .ipfs-footer-shield-mark {
        background: var(--ipfs-footer-reddit-orange);
        color: #fff7ed;
        opacity: 1;
      }

      .ipfs-footer-shield-symbol {
        display: block;
        width: 100%;
        height: 100%;
      }

      .ipfs-footer-verification[data-state=loading] .ipfs-footer-shield-symbol,
      .ipfs-footer-verification[data-state=verified] .ipfs-footer-shield-symbol {
        color: #bfdbfe;
      }

      .ipfs-footer-verification[data-state=warning] .ipfs-footer-shield-symbol,
      .ipfs-footer-verification[data-state=error] .ipfs-footer-shield-symbol {
        color: var(--ipfs-footer-reddit-orange);
      }

      @keyframes ipfs-footer-shield-spin {
        to { transform: translateY(0.02rem) rotate(360deg); }
      }

      .ipfs-footer-verification[open] .ipfs-footer-verification-summary {
        padding-bottom: 0.75rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.18);
      }

      .ipfs-footer-verification:not([open]) .ipfs-footer-verification-content {
        display: none;
      }

      .ipfs-footer-verification-content {
        padding-top: 0.75rem;
      }

      .ipfs-footer-status {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.35rem 0.6rem;
        border-radius: 999px;
        background: rgba(148, 163, 184, 0.16);
        color: #e2e8f0;
        font-size: 0.85rem;
        font-weight: 700;
      }

      .ipfs-footer-status[data-state=verified] {
        background: rgba(34, 197, 94, 0.14);
        color: #bbf7d0;
      }

      .ipfs-footer-status[data-state=warning],
      .ipfs-footer-status[data-state=error] {
        background: rgba(255, 69, 0, 0.14);
        color: var(--ipfs-footer-reddit-orange);
      }

      .ipfs-footer-status-dot {
        width: 0.55rem;
        height: 0.55rem;
        border-radius: 999px;
        background: currentColor;
        box-shadow: 0 0 16px currentColor;
      }

      .ipfs-footer-verification-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
        gap: 0.65rem;
        margin-top: 0.75rem;
      }

      .ipfs-footer-verification-detail {
        min-width: 0;
      }

      .ipfs-footer-verification-detail-wide {
        grid-column: 1 / -1;
      }

      .ipfs-footer-verification-detail-with-info {
        position: relative;
        padding-right: 2.15rem;
      }

      .ipfs-footer-info-icon {
        position: absolute;
        top: 50%;
        right: 0.45rem;
        transform: translateY(-50%);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.35rem;
        height: 1.35rem;
        border: 1px solid currentColor;
        border-radius: 999px;
        color: #bfdbfe;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 0.82rem;
        font-weight: 900;
        line-height: 1;
      }

      .ipfs-footer-verification-detail[role=button] {
        border-radius: 8px;
        cursor: pointer;
        outline: none;
      }

      .ipfs-footer-verification-detail[role=button]:hover,
      .ipfs-footer-verification-detail[role=button]:focus-visible {
        background: rgba(37, 99, 235, 0.12);
        box-shadow: 0 0 0 2px rgba(147, 197, 253, 0.35);
      }

      .ipfs-footer-verification-detail strong {
        display: block;
        color: #bfdbfe;
        font-size: 0.75rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .ipfs-footer-verification-detail span,
      .ipfs-footer-verification-detail a {
        color: #e5e7eb;
        overflow-wrap: anywhere;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 0.84rem;
      }

      .ipfs-footer-verification-detail[data-state=passed] strong,
      .ipfs-footer-verification-detail[data-state=passed] span,
      .ipfs-footer-verification-detail[data-state=passed] a {
        color: #bbf7d0;
      }

      .ipfs-footer-explainer,
      .ipfs-footer-public-gateways {
        margin-top: 0.75rem;
        color: #cbd5e1;
        font-size: 0.86rem;
      }

      .ipfs-footer-explainer {
        color: #cbd5e1;
        font-size: 0.86rem;
        line-height: 1.45;
      }

      .ipfs-footer-explainer strong,
      .ipfs-footer-public-gateways strong {
        color: #bfdbfe;
      }

      .ipfs-footer-public-gateways a {
        color: #bfdbfe;
        font-weight: 700;
      }

      .ipfs-footer-verification-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
        margin-top: 0.75rem;
      }

      .ipfs-footer-verification-actions a,
      .ipfs-footer-verification-actions button {
        border: 1px solid rgba(147, 197, 253, 0.55);
        border-radius: 999px;
        background: rgba(37, 99, 235, 0.18);
        color: #bfdbfe;
        cursor: pointer;
        font: inherit;
        font-size: 0.85rem;
        font-weight: 700;
        padding: 0.42rem 0.7rem;
        text-decoration: none;
      }

      .ipfs-footer-verification-actions a:hover,
      .ipfs-footer-verification-actions button:hover:not(:disabled) {
        background: rgba(37, 99, 235, 0.28);
      }

      .ipfs-footer-verification-actions button:disabled {
        border-color: rgba(148, 163, 184, 0.28);
        background: rgba(71, 85, 105, 0.16);
        color: rgba(203, 213, 225, 0.54);
        cursor: not-allowed;
        opacity: 0.72;
      }

      .ipfs-footer-modal[hidden] {
        display: none;
      }

      .ipfs-footer-modal {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }

      .ipfs-footer-modal-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(2, 6, 23, 0.72);
      }

      .ipfs-footer-modal-dialog {
        position: relative;
        z-index: 1;
        width: min(920px, 100%);
        max-height: min(82vh, 720px);
        overflow: auto;
        border: 1px solid rgba(147, 197, 253, 0.45);
        border-radius: 16px;
        background: #07111f;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
        color: #dbeafe;
        padding: 1rem;
      }

      .ipfs-footer-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.8rem;
      }

      .ipfs-footer-modal-title {
        margin: 0;
        color: #e0f2fe;
        font-size: 1rem;
      }

      .ipfs-footer-modal-close {
        border: 1px solid rgba(147, 197, 253, 0.55);
        border-radius: 999px;
        background: rgba(37, 99, 235, 0.18);
        color: #bfdbfe;
        cursor: pointer;
        font: inherit;
        font-weight: 800;
        padding: 0.25rem 0.6rem;
      }

      .ipfs-footer-gateway-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.82rem;
      }

      .ipfs-footer-gateway-table th,
      .ipfs-footer-gateway-table td {
        border-top: 1px solid rgba(148, 163, 184, 0.24);
        padding: 0.55rem;
        text-align: left;
        vertical-align: top;
      }

      .ipfs-footer-gateway-table th {
        color: #bfdbfe;
        font-size: 0.72rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .ipfs-footer-gateway-table a {
        color: #bfdbfe;
        font-weight: 700;
      }

      .ipfs-footer-gateway-table code {
        color: #e5e7eb;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        overflow-wrap: anywhere;
      }
    </style>
    <small>© ${copyrightYear} Lochner Technology · Minneapolis, MN</small>
    <details id="ipfs-footer-verification" class="ipfs-footer-verification" data-state="loading">
      <summary id="ipfs-footer-verification-summary" class="ipfs-footer-verification-summary" aria-labelledby="ipfs-footer-verification-title" aria-controls="ipfs-footer-verification-content" aria-expanded="false">
        <span class="ipfs-footer-verification-heading">
          <span class="ipfs-footer-shield" aria-hidden="true">
            <svg class="ipfs-footer-shield-symbol" viewBox="0 0 64 64" focusable="false" aria-hidden="true">
              <path fill="currentColor" d="M32 4 52 12v16c0 14.4-8.3 26.8-20 32C20.3 54.8 12 42.4 12 28V12L32 4Zm0 7.7-13 5.2V28c0 10.6 5.1 19.9 13 24.6C39.9 47.9 45 38.6 45 28V16.9l-13-5.2Z"></path>
            </svg>
            <span id="ipfs-footer-shield-mark" class="ipfs-footer-shield-mark"></span>
          </span>
          <h2 id="ipfs-footer-verification-title" class="ipfs-footer-verification-title">${verificationTitle}</h2>
        </span>
        <span id="ipfs-footer-summary-status" class="ipfs-footer-summary-status" data-state="loading" aria-hidden="true">Checking</span>
        <span class="ipfs-footer-summary-info-icon" aria-hidden="true" title="Expand verification details">i</span>
      </summary>
      <div id="ipfs-footer-verification-content" class="ipfs-footer-verification-content" hidden>
      <span id="ipfs-footer-status" class="ipfs-footer-status" data-state="loading" role="status" aria-live="polite">
        <span class="ipfs-footer-status-dot" aria-hidden="true"></span>
        <span id="ipfs-footer-status-message">Checking ${DOMAIN_NAME} publication…</span>
      </span>
      <div class="ipfs-footer-verification-details" aria-label="IPFS and Git version details">
        ${includeGithub ? `<div class="ipfs-footer-verification-detail">
          <strong>Git revision</strong>
          <span id="ipfs-footer-git-revision">pending</span>
        </div>` : ''}
        <div class="ipfs-footer-verification-detail">
          <strong>Current hash</strong>
          <span id="ipfs-footer-origin-hash">pending</span>
        </div>
        <div id="ipfs-footer-gateway-detail" class="ipfs-footer-verification-detail ipfs-footer-verification-detail-with-info" role="button" tabindex="0" aria-haspopup="dialog" aria-controls="ipfs-footer-gateway-modal" aria-describedby="ipfs-footer-gateway-info">
          <strong>Public gateway IPFS hash</strong>
          <span id="ipfs-footer-gateway-hash">pending</span>
          <span id="ipfs-footer-gateway-info" class="ipfs-footer-info-icon" aria-label="Open public gateway verification details">i</span>
        </div>
        ${includeGithub ? `<div id="ipfs-footer-github-detail" class="ipfs-footer-verification-detail">
          <strong>GitHub raw hash</strong>
          <span id="ipfs-footer-github-hash">pending</span>
        </div>` : ''}
        <div id="ipfs-footer-files-detail" class="ipfs-footer-verification-detail ipfs-footer-verification-detail-wide ipfs-footer-verification-detail-with-info" role="button" tabindex="0" aria-haspopup="dialog" aria-controls="ipfs-footer-files-modal" aria-describedby="ipfs-footer-files-info">
          <strong>Files verification</strong>
          <span id="ipfs-footer-files-status">pending</span>
          <span id="ipfs-footer-files-info" class="ipfs-footer-info-icon" aria-label="Open browser-hashed file details">i</span>
        </div>
      </div>
      <p class="ipfs-footer-explainer">
        <strong>How this verifies:</strong> The JavaScript fetches this site's manifest and public IPFS/IPNS gateway manifests, compares their Git revisions, aggregate content hashes, and every files[] path, byte count, and SHA-256 hash, then downloads and hashes the current site's non-image files in your browser.${includeGithub ? ' It also compares the GitHub raw manifest and current main-branch revision.' : ''}
      </p>
      <noscript>
        <p class="ipfs-footer-explainer"><strong>JavaScript is required</strong> to run the automatic verification. Without JavaScript, these controls can only open the evidence files.</p>
      </noscript>
      <div class="ipfs-footer-verification-actions">
        <button type="button" id="ipfs-footer-recheck-button">Run verification</button>
        <a id="ipfs-footer-manifest-link" href="/${MANIFEST_PATH}" target="_blank" rel="noopener">Open this site manifest</a>
        ${includeGithub ? `<a id="ipfs-footer-github-manifest-link" href="${GITHUB_RAW_MANIFEST_URL}" target="_blank" rel="noopener">Open GitHub raw manifest</a>` : ''}
      </div>
      <div class="ipfs-footer-public-gateways">
        <strong>View site on public gateways:</strong>
        ${publicGatewayLinks} ·
        <a href="${PUBLIC_GATEWAY_CHECKER_URL}" target="_blank" rel="noopener">gateway checker</a>
      </div>
      </div>
    </details>
    <div id="ipfs-footer-gateway-modal" class="ipfs-footer-modal" role="dialog" aria-modal="true" aria-labelledby="ipfs-footer-gateway-modal-title" hidden>
      <div class="ipfs-footer-modal-backdrop" data-ipfs-footer-modal-close></div>
      <div class="ipfs-footer-modal-dialog">
        <div class="ipfs-footer-modal-header">
          <h3 id="ipfs-footer-gateway-modal-title" class="ipfs-footer-modal-title">Public gateway verification states</h3>
          <button type="button" id="ipfs-footer-gateway-modal-close" class="ipfs-footer-modal-close" aria-label="Close public gateway verification states">Close</button>
        </div>
        <table class="ipfs-footer-gateway-table">
          <thead>
            <tr>
              <th scope="col">Gateway</th>
              <th scope="col">Verification state</th>
              <th scope="col">Git revision</th>
              <th scope="col">Content hash</th>
            </tr>
          </thead>
          <tbody id="ipfs-footer-gateway-modal-body">
            <tr><td colspan="4">Run verification to load gateway states.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="ipfs-footer-files-modal" class="ipfs-footer-modal" role="dialog" aria-modal="true" aria-labelledby="ipfs-footer-files-modal-title" hidden>
      <div class="ipfs-footer-modal-backdrop" data-ipfs-footer-files-modal-close></div>
      <div class="ipfs-footer-modal-dialog">
        <div class="ipfs-footer-modal-header">
          <h3 id="ipfs-footer-files-modal-title" class="ipfs-footer-modal-title">Browser-hashed files</h3>
          <button type="button" id="ipfs-footer-files-modal-close" class="ipfs-footer-modal-close" aria-label="Close browser-hashed file details">Close</button>
        </div>
        <table class="ipfs-footer-gateway-table">
          <thead>
            <tr>
              <th scope="col">File</th>
              <th scope="col">Bytes</th>
              <th scope="col">Expected SHA-256</th>
              <th scope="col">Browser SHA-256</th>
            </tr>
          </thead>
          <tbody id="ipfs-footer-files-modal-body">
            <tr><td colspan="4">Run verification to hash current-site non-image files in this browser.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <script>
      (function () {
        const IPNS_ID = '${IPNS_ID}';
        const MANIFEST_PATH = '${MANIFEST_PATH}';
        const VERIFICATION_NOT_BEFORE_PATH = '${VERIFICATION_NOT_BEFORE_PATH}';
        const CURRENT_MANIFEST_URL = resolveCurrentPublishedUrl(MANIFEST_PATH);
        const VERIFICATION_NOT_BEFORE_URL = resolveCurrentPublishedUrl(VERIFICATION_NOT_BEFORE_PATH);
        const GITHUB_RAW_MANIFEST_URL = ${includeGithub ? `'${GITHUB_RAW_MANIFEST_URL}'` : 'null'};
        const GITHUB_MAIN_COMMIT_API_URL = ${includeGithub ? `'${GITHUB_MAIN_COMMIT_API_URL}'` : 'null'};
        const IPFS_GATEWAYS = ${publicGatewayManifestEntries};

        const INCLUDE_GITHUB_VERIFICATION = ${includeGithub};
        const verificationEl = document.getElementById('ipfs-footer-verification');
        const verificationSummaryEl = document.getElementById('ipfs-footer-verification-summary');
        const verificationContentEl = document.getElementById('ipfs-footer-verification-content');
        const summaryStatusEl = document.getElementById('ipfs-footer-summary-status');
        const statusEl = document.getElementById('ipfs-footer-status');
        const statusMessageEl = document.getElementById('ipfs-footer-status-message');
        const shieldMarkEl = document.getElementById('ipfs-footer-shield-mark');
        const gitRevisionEl = document.getElementById('ipfs-footer-git-revision');
        const originHashEl = document.getElementById('ipfs-footer-origin-hash');
        const gatewayHashEl = document.getElementById('ipfs-footer-gateway-hash');
        const githubHashEl = document.getElementById('ipfs-footer-github-hash');
        const filesStatusEl = document.getElementById('ipfs-footer-files-status');
        const gatewayDetailEl = document.getElementById('ipfs-footer-gateway-detail');
        const githubDetailEl = document.getElementById('ipfs-footer-github-detail');
        const filesDetailEl = document.getElementById('ipfs-footer-files-detail');
        const recheckButton = document.getElementById('ipfs-footer-recheck-button');
        const manifestLinkEl = document.getElementById('ipfs-footer-manifest-link');
        const gatewayModalEl = document.getElementById('ipfs-footer-gateway-modal');
        const gatewayModalBodyEl = document.getElementById('ipfs-footer-gateway-modal-body');
        const gatewayModalCloseEl = document.getElementById('ipfs-footer-gateway-modal-close');
        const filesModalEl = document.getElementById('ipfs-footer-files-modal');
        const filesModalBodyEl = document.getElementById('ipfs-footer-files-modal-body');
        const filesModalCloseEl = document.getElementById('ipfs-footer-files-modal-close');
        let verificationDelayTimerId = null;
        let verificationCountdownTimerId = null;
        let verificationNotBefore = '';
        let gatewayModalRows = IPFS_GATEWAYS.map((gateway) => ({
          label: gateway.label,
          siteUrl: gateway.siteUrl,
          manifestUrl: gateway.manifestUrl,
          state: 'Not checked',
          revision: null,
          hash: null,
          error: null
        }));
        let filesModalRows = [];

        function setVerificationExpanded(expanded) {
          verificationEl.open = expanded;
          verificationSummaryEl.setAttribute('aria-expanded', String(expanded));
          verificationContentEl.hidden = !expanded;
        }

        setVerificationExpanded(false);

        function resolveCurrentPublishedUrl(resourcePath) {
          const path = window.location.pathname;
          const ipnsPrefix = '/ipns/' + IPNS_ID + '/';
          const ipfsPathParts = path.split('/');
          const ipfsPrefix = ipfsPathParts[1] === 'ipfs' && ipfsPathParts[2]
            ? '/ipfs/' + ipfsPathParts[2] + '/'
            : null;

          if (path === ipnsPrefix.slice(0, -1) || path.startsWith(ipnsPrefix)) {
            return window.location.origin + ipnsPrefix + resourcePath;
          }

          if (ipfsPrefix) {
            return window.location.origin + ipfsPrefix + resourcePath;
          }

          return window.location.origin + '/' + resourcePath;
        }

        function shortHash(hash) {
          return hash ? hash.slice(0, 16) + '…' + hash.slice(-12) : 'unavailable';
        }

        function shortRevision(revision) {
          return revision ? revision.slice(0, 12) + '…' : 'unavailable';
        }

        function formatRevision(revision) {
          return revision || 'unavailable';
        }

        function formatRevisionList(revisions) {
          return revisions.length ? revisions.map(formatRevision).join(', ') : 'none';
        }

        function isImageManifestPath(filePath) {
          return /\.(?:avif|bmp|gif|ico|jpe?g|png|svg|webp)$/i.test(filePath || '');
        }

        function toHex(buffer) {
          return Array.from(new Uint8Array(buffer))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');
        }

        async function sha256ArrayBuffer(buffer) {
          if (!window.crypto || !window.crypto.subtle || typeof window.crypto.subtle.digest !== 'function') {
            throw new Error('Web Crypto SHA-256 is unavailable in this browser context');
          }

          return toHex(await window.crypto.subtle.digest('SHA-256', buffer));
        }

        async function fetchAndHashManifestFile(file) {
          const url = resolveCurrentPublishedUrl(file.path);
          const response = await fetch(url + '?verify=' + Date.now(), { cache: 'no-store' });
          if (!response.ok) {
            throw new Error(response.status + ' ' + response.statusText);
          }

          const buffer = await response.arrayBuffer();
          const actualSha256 = await sha256ArrayBuffer(buffer);
          const result = {
            path: file.path,
            expectedBytes: file.bytes,
            actualBytes: buffer.byteLength,
            expectedSha256: file.sha256,
            actualSha256,
            url
          };

          logVerificationStep('browser live file hash', {
            path: result.path,
            url: result.url,
            expectedBytes: result.expectedBytes,
            actualBytes: result.actualBytes,
            expectedSha256: result.expectedSha256,
            actualSha256: result.actualSha256,
            bytesMatch: result.expectedBytes === result.actualBytes,
            sha256Matches: String(result.expectedSha256).toLowerCase() === result.actualSha256
          });

          return result;
        }

        async function verifyCurrentSiteFileBytes(manifest) {
          if (!manifest || !Array.isArray(manifest.files)) {
            return {
              matches: false,
              checked: 0,
              skippedImages: 0,
              mismatched: [],
              failed: [{ path: '(manifest.files)', error: 'missing or not an array' }]
            };
          }

          const filesToHash = manifest.files.filter((file) => isValidManifestFileEntry(file) && !isImageManifestPath(file.path));
          const skippedImageFiles = manifest.files.filter((file) => isValidManifestFileEntry(file) && isImageManifestPath(file.path));
          const skippedImages = skippedImageFiles.length;
          logVerificationStep('browser live file hash queue', {
            filesToHash: filesToHash.map((file) => file.path),
            skippedImages: skippedImageFiles.map((file) => file.path)
          });
          const results = await Promise.allSettled(filesToHash.map(fetchAndHashManifestFile));
          const checked = [];
          const mismatched = [];
          const failed = [];

          results.forEach((result, index) => {
            const manifestFile = filesToHash[index];
            if (result.status === 'rejected') {
              failed.push({ path: manifestFile.path, error: result.reason && result.reason.message ? result.reason.message : 'unknown error' });
              return;
            }

            checked.push(result.value);
            const reasons = [];
            if (result.value.expectedBytes !== result.value.actualBytes) {
              reasons.push('bytes');
            }
            if (String(result.value.expectedSha256).toLowerCase() !== result.value.actualSha256) {
              reasons.push('sha256');
            }
            if (reasons.length) {
              mismatched.push(Object.assign({}, result.value, { reasons }));
            }
          });

          return {
            matches: mismatched.length === 0 && failed.length === 0,
            checked: checked.length,
            checkedFiles: checked,
            skippedImages,
            mismatched,
            failed
          };
        }

        function logVerificationStep(step, details) {
          if (details === undefined) {
            console.info('[IPFS verification]', step);
          } else {
            console.info('[IPFS verification]', step, details);
          }
        }

        function isValidManifestFileEntry(file) {
          return file &&
            typeof file.path === 'string' &&
            file.path.trim() !== '' &&
            typeof file.bytes === 'number' &&
            Number.isFinite(file.bytes) &&
            /^[0-9a-f]{64}$/i.test(file.sha256 || '');
        }

        function describeManifestFileEntry(file, index) {
          if (!file || typeof file !== 'object') {
            return { path: '(entry #' + index + ')', bytes: null, sha256: null, invalid: true };
          }

          return {
            path: typeof file.path === 'string' && file.path.trim() !== '' ? file.path : '(entry #' + index + ')',
            bytes: typeof file.bytes === 'number' && Number.isFinite(file.bytes) ? file.bytes : null,
            sha256: typeof file.sha256 === 'string' ? file.sha256 : null,
            invalid: !isValidManifestFileEntry(file)
          };
        }

        function normalizeManifestFiles(manifest) {
          const filesByPath = new Map();
          filesByPath.invalid = [];

          if (!manifest || !Array.isArray(manifest.files)) {
            filesByPath.invalid.push({ path: '(manifest.files)', reason: 'missing or not an array' });
            return filesByPath;
          }

          manifest.files.forEach((file, index) => {
            const normalizedFile = describeManifestFileEntry(file, index);
            if (normalizedFile.invalid) {
              filesByPath.invalid.push(normalizedFile);
              return;
            }

            if (filesByPath.has(normalizedFile.path)) {
              filesByPath.invalid.push({
                path: normalizedFile.path,
                bytes: normalizedFile.bytes,
                sha256: normalizedFile.sha256,
                reason: 'duplicate path'
              });
              return;
            }

            filesByPath.set(normalizedFile.path, {
              path: normalizedFile.path,
              bytes: normalizedFile.bytes,
              sha256: normalizedFile.sha256.toLowerCase()
            });
          });

          return filesByPath;
        }

        function summarizeFileComparison(comparison) {
          if (!comparison) {
            return null;
          }

          return {
            matches: comparison.matches,
            missing: comparison.missing.map((file) => file.path),
            extra: comparison.extra.map((file) => file.path),
            mismatched: comparison.mismatched.map((entry) => ({
              path: entry.path,
              referenceBytes: entry.reference ? entry.reference.bytes : null,
              candidateBytes: entry.candidate ? entry.candidate.bytes : null,
              referenceSha256: entry.reference ? entry.reference.sha256 : null,
              candidateSha256: entry.candidate ? entry.candidate.sha256 : null,
              reasons: entry.reasons
            }))
          };
        }

        function compareManifestFiles(referenceManifest, candidateManifest) {
          const referenceFiles = normalizeManifestFiles(referenceManifest);
          const candidateFiles = normalizeManifestFiles(candidateManifest);
          const missing = [];
          const extra = [];
          const mismatched = [];

          referenceFiles.forEach((referenceFile, path) => {
            const candidateFile = candidateFiles.get(path);
            if (!candidateFile) {
              missing.push(referenceFile);
              return;
            }

            const reasons = [];
            if (referenceFile.bytes !== candidateFile.bytes) {
              reasons.push('bytes');
            }
            if (referenceFile.sha256 !== candidateFile.sha256) {
              reasons.push('sha256');
            }
            if (reasons.length) {
              mismatched.push({ path, reference: referenceFile, candidate: candidateFile, reasons });
            }
          });

          candidateFiles.forEach((candidateFile, path) => {
            if (!referenceFiles.has(path)) {
              extra.push(candidateFile);
            }
          });

          referenceFiles.invalid.forEach((file) => mismatched.push({
            path: file.path,
            reference: file,
            candidate: null,
            reasons: ['invalid reference file entry']
          }));
          candidateFiles.invalid.forEach((file) => mismatched.push({
            path: file.path,
            reference: null,
            candidate: file,
            reasons: ['invalid candidate file entry']
          }));

          return {
            matches: missing.length === 0 && extra.length === 0 && mismatched.length === 0,
            missing,
            extra,
            mismatched
          };
        }

        function summarizeManifest(manifest, fileComparison) {
          if (!manifest) {
            return null;
          }

          const summary = {
            gitRevision: manifest.gitRevision || null,
            gitRevisionDirty: Boolean(manifest.gitRevisionDirty),
            contentSha256: manifest.contentSha256 || null,
            previousContentSha256: Array.isArray(manifest.previousContentSha256)
              ? manifest.previousContentSha256
              : [],
            gitCommitUrl: manifest.gitCommitUrl || null,
            fileCount: Array.isArray(manifest.files) ? manifest.files.length : 0
          };

          if (fileComparison && !fileComparison.matches) {
            summary.fileMismatch = summarizeFileComparison(fileComparison);
          }

          return summary;
        }

        function getVerificationDelayRemainingMs() {
          if (!verificationNotBefore) {
            return 0;
          }

          const notBeforeTime = Date.parse(verificationNotBefore);
          return Number.isNaN(notBeforeTime) ? 0 : Math.max(0, notBeforeTime - Date.now());
        }

        function formatCountdown(ms) {
          const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          return minutes + ':' + String(seconds).padStart(2, '0');
        }

        function setRecheckButtonDisabled(disabled) {
          recheckButton.disabled = disabled;
          recheckButton.setAttribute('aria-disabled', String(disabled));
        }

        function clearVerificationDelayTimers() {
          if (verificationDelayTimerId) {
            window.clearTimeout(verificationDelayTimerId);
            verificationDelayTimerId = null;
          }
          if (verificationCountdownTimerId) {
            window.clearInterval(verificationCountdownTimerId);
            verificationCountdownTimerId = null;
          }
        }

        function setStatus(state, message) {
          verificationEl.dataset.state = state;
          summaryStatusEl.dataset.state = state;
          summaryStatusEl.textContent = state === 'verified' ? 'Verified' : state === 'loading' ? 'Checking' : state === 'pending' ? 'Waiting' : 'Failed';
          statusEl.dataset.state = state;
          statusMessageEl.textContent = message;
          shieldMarkEl.textContent = state === 'verified' ? '✓' : (state === 'loading' || state === 'pending') ? '' : '×';
          logVerificationStep('status: ' + state, message);
        }

        function setGitRevision(manifest) {
          if (!gitRevisionEl) return;
          const dirtySuffix = manifest.gitRevisionDirty ? ' + uncommitted changes' : '';
          gitRevisionEl.textContent = shortRevision(manifest.gitRevision) + dirtySuffix;
          gitRevisionEl.title = manifest.gitRevision || '';
          if (manifest.gitCommitUrl) {
            gitRevisionEl.innerHTML = '';
            const link = document.createElement('a');
            link.href = manifest.gitCommitUrl;
            link.target = '_blank';
            link.rel = 'noopener';
            link.textContent = shortRevision(manifest.gitRevision) + dirtySuffix;
            link.title = manifest.gitRevision || '';
            gitRevisionEl.appendChild(link);
          }
        }

        async function fetchVerificationNotBefore() {
          logVerificationStep('fetch start: verification delay timestamp', { url: VERIFICATION_NOT_BEFORE_URL });

          try {
            const response = await fetch(VERIFICATION_NOT_BEFORE_URL + '?verify=' + Date.now(), { cache: 'no-store' });
            if (response.status === 404) {
              logVerificationStep('verification delay timestamp not found; checking immediately');
              return '';
            }
            if (!response.ok) {
              throw new Error(response.status + ' ' + response.statusText);
            }

            const timestamp = (await response.text()).trim();
            if (!timestamp || Number.isNaN(Date.parse(timestamp))) {
              logVerificationStep('verification delay timestamp invalid; checking immediately', { timestamp });
              return '';
            }

            const normalizedTimestamp = new Date(timestamp).toISOString();
            logVerificationStep('verification delay timestamp loaded', normalizedTimestamp);
            return normalizedTimestamp;
          } catch (error) {
            logVerificationStep('verification delay timestamp unavailable; checking immediately', { error: error.message });
            return '';
          }
        }

        function fetchJson(url, timeoutMs = 12000, label = 'JSON') {
          logVerificationStep('fetch start: ' + label, { url, timeoutMs });
          const controller = new AbortController();
          const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

          return fetch(url, { cache: 'no-store', signal: controller.signal })
            .then((response) => {
              if (!response.ok) {
                throw new Error(response.status + ' ' + response.statusText);
              }
              logVerificationStep('fetch response: ' + label, {
                url,
                status: response.status,
                statusText: response.statusText
              });
              return response.json();
            })
            .catch((error) => {
              if (error.name === 'AbortError') {
                const timeoutError = new Error('timed out after ' + Math.round(timeoutMs / 1000) + 's');
                logVerificationStep('fetch failed: ' + label, { url, error: timeoutError.message });
                throw timeoutError;
              }
              logVerificationStep('fetch failed: ' + label, { url, error: error.message });
              throw error;
            })
            .finally(() => window.clearTimeout(timeoutId));
        }

        function renderGatewayModalRows(rows) {
          gatewayModalBodyEl.innerHTML = '';
          rows.forEach((row) => {
            const tr = document.createElement('tr');
            const gatewayTd = document.createElement('td');
            const gatewayLink = document.createElement('a');
            gatewayLink.href = row.siteUrl;
            gatewayLink.target = '_blank';
            gatewayLink.rel = 'noopener';
            gatewayLink.textContent = row.label;
            gatewayTd.appendChild(gatewayLink);

            const stateTd = document.createElement('td');
            stateTd.textContent = row.state + (row.error ? ': ' + row.error : '');

            const revisionTd = document.createElement('td');
            const revisionCode = document.createElement('code');
            revisionCode.textContent = shortRevision(row.revision);
            revisionCode.title = row.revision || '';
            revisionTd.appendChild(revisionCode);

            const hashTd = document.createElement('td');
            const hashCode = document.createElement('code');
            hashCode.textContent = shortHash(row.hash);
            hashCode.title = row.hash || '';
            hashTd.appendChild(hashCode);

            tr.appendChild(gatewayTd);
            tr.appendChild(stateTd);
            tr.appendChild(revisionTd);
            tr.appendChild(hashTd);
            gatewayModalBodyEl.appendChild(tr);
          });
        }

        function openGatewayModal() {
          renderGatewayModalRows(gatewayModalRows);
          gatewayModalEl.hidden = false;
          gatewayModalCloseEl.focus();
        }

        function closeGatewayModal() {
          gatewayModalEl.hidden = true;
          gatewayDetailEl.focus();
        }

        function renderFilesModalRows(rows) {
          filesModalBodyEl.innerHTML = '';
          if (!rows.length) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 4;
            td.textContent = 'Run verification to hash current-site non-image files in this browser.';
            tr.appendChild(td);
            filesModalBodyEl.appendChild(tr);
            return;
          }

          rows.forEach((row) => {
            const tr = document.createElement('tr');
            const pathTd = document.createElement('td');
            const pathCode = document.createElement('code');
            pathCode.textContent = row.path;
            pathCode.title = row.url || row.path;
            pathTd.appendChild(pathCode);

            const bytesTd = document.createElement('td');
            bytesTd.textContent = String(row.actualBytes) + (row.expectedBytes === row.actualBytes ? '' : ' (expected ' + row.expectedBytes + ')');

            const expectedTd = document.createElement('td');
            const expectedCode = document.createElement('code');
            expectedCode.textContent = row.expectedSha256 || 'unavailable';
            expectedTd.appendChild(expectedCode);

            const actualTd = document.createElement('td');
            const actualCode = document.createElement('code');
            actualCode.textContent = row.actualSha256 || 'unavailable';
            actualTd.appendChild(actualCode);

            tr.appendChild(pathTd);
            tr.appendChild(bytesTd);
            tr.appendChild(expectedTd);
            tr.appendChild(actualTd);
            filesModalBodyEl.appendChild(tr);
          });
        }

        function openFilesModal() {
          renderFilesModalRows(filesModalRows);
          filesModalEl.hidden = false;
          filesModalCloseEl.focus();
        }

        function closeFilesModal() {
          filesModalEl.hidden = true;
          filesDetailEl.focus();
        }

        async function fetchGatewayManifests() {
          const results = await Promise.allSettled(IPFS_GATEWAYS.map(async (gateway) => ({
            gatewayUrl: gateway.manifestUrl,
            label: gateway.label,
            siteUrl: gateway.siteUrl,
            manifest: await fetchJson(gateway.manifestUrl + '?verify=' + Date.now(), 8000, 'public gateway manifest: ' + gateway.manifestUrl)
          })));
          logVerificationStep('public gateway fetch settled', results.map((result, index) => ({
            gatewayUrl: IPFS_GATEWAYS[index].manifestUrl,
            status: result.status,
            error: result.status === 'rejected' && result.reason ? result.reason.message : null,
            manifest: result.status === 'fulfilled' ? summarizeManifest(result.value.manifest) : null
          })));
          const fulfilled = results
            .filter((result) => result.status === 'fulfilled')
            .map((result) => result.value);

          return {
            fulfilled,
            failed: results
              .map((result, index) => ({ result, gateway: IPFS_GATEWAYS[index] }))
              .filter((entry) => entry.result.status === 'rejected')
              .map((entry) => ({
                label: entry.gateway.label,
                siteUrl: entry.gateway.siteUrl,
                gatewayUrl: entry.gateway.manifestUrl,
                error: entry.result.reason && entry.result.reason.message ? entry.result.reason.message : 'unknown error'
              })),
            failedCount: results.length - fulfilled.length,
            totalCount: results.length
          };
        }

        function setDetail(el, value, title) {
          el.textContent = value;
          el.title = title || '';
        }

        function setDetailState(el, state) {
          if (state) {
            el.dataset.state = state;
          } else {
            delete el.dataset.state;
          }
        }

        async function fetchGithubMainCommit() {
          const commit = await fetchJson(GITHUB_MAIN_COMMIT_API_URL + '?verify=' + Date.now(), 8000, 'GitHub main commit API');

          if (!commit || typeof commit.sha !== 'string' || !commit.sha) {
            throw new Error('GitHub main commit response did not include a commit SHA');
          }

          const summarizedCommit = {
            sha: commit.sha,
            parentShas: Array.isArray(commit.parents)
              ? commit.parents.map((parent) => parent && parent.sha).filter(Boolean)
              : []
          };
          logVerificationStep('GitHub main commit parsed', summarizedCommit);
          return summarizedCommit;
        }

        async function scheduleVerificationAfterDelay() {
          verificationNotBefore = await fetchVerificationNotBefore();
          const remainingMs = getVerificationDelayRemainingMs();
          if (remainingMs <= 0) {
            clearVerificationDelayTimers();
            runVerification();
            return;
          }

          const updatePendingStatus = () => {
            const currentRemainingMs = getVerificationDelayRemainingMs();
            setStatus('pending', 'Waiting ' + formatCountdown(currentRemainingMs) + ' before checking public IPFS gateways for this new update.');
            setRecheckButtonDisabled(true);
          };

          clearVerificationDelayTimers();
          updatePendingStatus();
          verificationCountdownTimerId = window.setInterval(updatePendingStatus, 1000);
          verificationDelayTimerId = window.setTimeout(() => {
            clearVerificationDelayTimers();
            runVerification();
          }, remainingMs);
        }

        async function runVerification() {
          console.group('[IPFS verification] run');
          logVerificationStep('configuration', {
            currentManifestUrl: CURRENT_MANIFEST_URL,
            verificationNotBeforeUrl: VERIFICATION_NOT_BEFORE_URL,
            githubRawManifestUrl: GITHUB_RAW_MANIFEST_URL,
            githubMainCommitApiUrl: GITHUB_MAIN_COMMIT_API_URL,
            publicGatewayManifestUrls: IPFS_GATEWAYS.map((gateway) => gateway.manifestUrl)
          });
          setStatus('loading', 'Checking ${DOMAIN_NAME} publication…');
          if (gitRevisionEl) gitRevisionEl.textContent = 'checking…';
          originHashEl.textContent = 'checking…';
          gatewayHashEl.textContent = 'checking…';
          if (githubHashEl) githubHashEl.textContent = 'checking…';
          filesStatusEl.textContent = 'checking files[] entries…';
          gatewayModalRows = IPFS_GATEWAYS.map((gateway) => ({
            label: gateway.label,
            siteUrl: gateway.siteUrl,
            manifestUrl: gateway.manifestUrl,
            state: 'Checking',
            revision: null,
            hash: null,
            error: null
          }));
          renderGatewayModalRows(gatewayModalRows);
          filesModalRows = [];
          renderFilesModalRows(filesModalRows);
          setDetailState(gatewayDetailEl, null);
          if (githubDetailEl) setDetailState(githubDetailEl, null);
          setDetailState(filesDetailEl, null);
          setRecheckButtonDisabled(true);

          try {
            const originManifest = await fetchJson(CURRENT_MANIFEST_URL + '?verify=' + Date.now(), 8000, 'current site manifest');
            logVerificationStep('current site manifest parsed', summarizeManifest(originManifest));
            setDetail(originHashEl, shortHash(originManifest.contentSha256), originManifest.contentSha256);
            setGitRevision(originManifest);
            manifestLinkEl.href = CURRENT_MANIFEST_URL;
            setStatus('loading', 'Loaded current site manifest; checking ' + (INCLUDE_GITHUB_VERIFICATION ? 'GitHub and ' : '') + 'IPFS…');

            const [githubManifest, gatewayResult, githubMainCommit] = await Promise.all([
              INCLUDE_GITHUB_VERIFICATION ? fetchJson(GITHUB_RAW_MANIFEST_URL + '?verify=' + Date.now(), 8000, 'GitHub raw manifest') : Promise.resolve(originManifest),
              fetchGatewayManifests(),
              INCLUDE_GITHUB_VERIFICATION ? fetchGithubMainCommit() : Promise.resolve({ sha: originManifest.gitRevision, parentShas: [] })
            ]);

            const liveFileComparison = await verifyCurrentSiteFileBytes(originManifest);
            filesModalRows = liveFileComparison.checkedFiles || [];
            renderFilesModalRows(filesModalRows);
            logVerificationStep('current site live file hashes', liveFileComparison);

            const githubFileComparison = compareManifestFiles(originManifest, githubManifest);
            if (INCLUDE_GITHUB_VERIFICATION) {
              logVerificationStep('GitHub raw manifest parsed', summarizeManifest(githubManifest, githubFileComparison));
            }
            const githubAggregateContentMatchesOrigin = githubManifest.contentSha256 === originManifest.contentSha256;
            const githubRevisionMatchesOrigin = githubManifest.gitRevision === originManifest.gitRevision;
            const githubManifestMatchesOrigin = githubAggregateContentMatchesOrigin &&
              githubRevisionMatchesOrigin &&
              githubFileComparison.matches;
            if (githubHashEl) setDetail(githubHashEl, shortHash(githubManifest.contentSha256), githubManifest.contentSha256);
            if (githubDetailEl) setDetailState(githubDetailEl, githubManifestMatchesOrigin ? 'passed' : null);

            const gatewayResults = gatewayResult.fulfilled.map((result) => {
              const aggregateContentMatchesOrigin = result.manifest.contentSha256 === originManifest.contentSha256;
              const revisionMatchesOrigin = result.manifest.gitRevision === originManifest.gitRevision;
              const fileComparison = aggregateContentMatchesOrigin && revisionMatchesOrigin
                ? compareManifestFiles(originManifest, result.manifest)
                : null;
              return Object.assign({}, result, {
                aggregateContentMatchesOrigin,
                revisionMatchesOrigin,
                fileComparison,
                matchesOrigin: aggregateContentMatchesOrigin && revisionMatchesOrigin && fileComparison && fileComparison.matches
              });
            });
            const knownPreviousContentHashes = Array.isArray(originManifest.previousContentSha256)
              ? originManifest.previousContentSha256
              : [];
            const matchingGatewayResults = gatewayResults.filter((result) => result.matchesOrigin);
            const aggregateMatchingGatewayResults = gatewayResults.filter((result) =>
              result.aggregateContentMatchesOrigin && result.revisionMatchesOrigin
            );
            const olderGatewayResults = gatewayResults.filter((result) =>
              knownPreviousContentHashes.includes(result.manifest.contentSha256) &&
              result.manifest.contentSha256 !== originManifest.contentSha256
            );
            const primaryGatewayResult = matchingGatewayResults[0] || aggregateMatchingGatewayResults[0] || gatewayResults[0] || null;
            const gatewayManifest = primaryGatewayResult ? primaryGatewayResult.manifest : null;
            const hasMatchingGatewayManifest = matchingGatewayResults.length > 0;
            gatewayModalRows = IPFS_GATEWAYS.map((gateway) => {
              const fulfilledGateway = gatewayResults.find((result) => result.gatewayUrl === gateway.manifestUrl);
              const failedGateway = gatewayResult.failed.find((result) => result.gatewayUrl === gateway.manifestUrl);
              if (fulfilledGateway) {
                const isKnownOlder = knownPreviousContentHashes.includes(fulfilledGateway.manifest.contentSha256) &&
                  fulfilledGateway.manifest.contentSha256 !== originManifest.contentSha256;
                return {
                  label: gateway.label,
                  siteUrl: gateway.siteUrl,
                  manifestUrl: gateway.manifestUrl,
                  state: fulfilledGateway.matchesOrigin ? 'Verified current' : isKnownOlder ? 'Known older version' : 'Mismatch',
                  revision: fulfilledGateway.manifest.gitRevision || null,
                  hash: fulfilledGateway.manifest.contentSha256 || null,
                  error: null
                };
              }
              return {
                label: gateway.label,
                siteUrl: gateway.siteUrl,
                manifestUrl: gateway.manifestUrl,
                state: 'Fetch failed',
                revision: null,
                hash: null,
                error: failedGateway ? failedGateway.error : 'unknown error'
              };
            });
            renderGatewayModalRows(gatewayModalRows);
            setDetail(
              gatewayHashEl,
              gatewayManifest ? shortHash(gatewayManifest.contentSha256) : 'unavailable',
              gatewayModalRows.map((row) => row.manifestUrl + ' — ' + row.state + ' — ' + (row.revision || 'no revision') + ' — ' + (row.hash || row.error || 'no content hash')).join(String.fromCharCode(10))
            );
            setDetailState(gatewayDetailEl, hasMatchingGatewayManifest ? 'passed' : null);
            const sameContent = githubAggregateContentMatchesOrigin && hasMatchingGatewayManifest;
            const sameRevision = githubRevisionMatchesOrigin && hasMatchingGatewayManifest;
            const sameFiles = githubFileComparison.matches && hasMatchingGatewayManifest && liveFileComparison.matches;
            const verifiedFileCount = Array.isArray(originManifest.files) ? originManifest.files.length : 0;
            const matchingGatewayLabels = matchingGatewayResults.map((result) => result.label).filter(Boolean);
            filesStatusEl.textContent = sameFiles
              ? verifiedFileCount + ' files match ' + (INCLUDE_GITHUB_VERIFICATION ? 'GitHub raw and ' : '') + formatRevisionList(matchingGatewayLabels) + '; browser hashed ' + liveFileComparison.checked + ' non-image files'
              : 'Mismatch, unavailable gateway, or live browser hash failure';
            filesStatusEl.title = sameFiles
              ? 'Every files[] path, byte count, and SHA-256 hash in this site manifest matches ' + (INCLUDE_GITHUB_VERIFICATION ? 'GitHub raw and ' : '') + 'at least one public gateway manifest; the browser also fetched and hashed current-site non-image files. Image files were skipped.'
              : 'The files[] entries did not match across this site, ' + (INCLUDE_GITHUB_VERIFICATION ? 'GitHub raw, and ' : '') + 'a public gateway manifest, or the browser live hash check failed for current-site non-image files.';
            setDetailState(filesDetailEl, sameFiles ? 'passed' : null);
            const githubMainAcceptableRevisions = [githubMainCommit.sha].concat(githubMainCommit.parentShas);
            const manifestRevisionIsCurrentGithubPublication = !INCLUDE_GITHUB_VERIFICATION ||
              githubMainAcceptableRevisions.includes(githubManifest.gitRevision) &&
              githubMainAcceptableRevisions.includes(originManifest.gitRevision) &&
              matchingGatewayResults.some((result) => githubMainAcceptableRevisions.includes(result.manifest.gitRevision));
            const anyDirtyManifest = originManifest.gitRevisionDirty || githubManifest.gitRevisionDirty ||
              gatewayResults.some((result) => result.manifest.gitRevisionDirty);
            const gatewayFileComparisons = gatewayResults.map((result) => ({
              label: result.label,
              manifestUrl: result.gatewayUrl,
              aggregateContentMatchesOrigin: result.aggregateContentMatchesOrigin,
              revisionMatchesOrigin: result.revisionMatchesOrigin,
              fileComparison: summarizeFileComparison(result.fileComparison)
            }));

            logVerificationStep('comparison results', {
              sameContent,
              sameRevision,
              sameFiles,
              liveFiles: liveFileComparison,
              github: {
                aggregateContentMatchesOrigin: githubAggregateContentMatchesOrigin,
                revisionMatchesOrigin: githubRevisionMatchesOrigin,
                fileComparison: summarizeFileComparison(githubFileComparison)
              },
              gateways: gatewayFileComparisons,
              hasMatchingGatewayManifest,
              manifestRevisionIsCurrentGithubPublication,
              anyDirtyManifest,
              matchingGatewayCount: matchingGatewayResults.length,
              aggregateMatchingGatewayCount: aggregateMatchingGatewayResults.length,
              checkedGatewayCount: gatewayResult.totalCount,
              failedGatewayCount: gatewayResult.failedCount,
              olderGatewayCount: olderGatewayResults.length,
              knownPreviousContentHashes,
              acceptableGithubRevisions: githubMainAcceptableRevisions
            });

            if (anyDirtyManifest) {
              setStatus('warning', 'Uncommitted changes reported; this build cannot be fully verified.');
            } else if (!hasMatchingGatewayManifest && olderGatewayResults.length) {
              setStatus('warning', 'Outdated: checked public IPFS gateways are serving a known older site version.');
            } else if (!sameContent) {
              setStatus('warning', 'Aggregate content mismatch: current site, ' + (INCLUDE_GITHUB_VERIFICATION ? 'GitHub raw manifest, and ' : '') + 'at least one public IPFS gateway must report the same content hash.');
            } else if (!sameRevision) {
              setStatus('warning', 'Git revision mismatch: current site, ' + (INCLUDE_GITHUB_VERIFICATION ? 'GitHub raw manifest, and ' : '') + 'at least one public IPFS gateway must point at the same Git revision.');
            } else if (!sameFiles) {
              setStatus('warning', 'Per-file mismatch: files[] paths, byte counts, and SHA-256 hashes must match between this site, ' + (INCLUDE_GITHUB_VERIFICATION ? 'GitHub raw, and ' : '') + 'at least one public IPFS gateway, and the browser must hash all current-site non-image files to the manifest values.');
            } else if (!manifestRevisionIsCurrentGithubPublication) {
              const matchingGatewayRevisions = matchingGatewayResults.map((result) => result.manifest.gitRevision).filter(Boolean);
              setStatus(
                'warning',
                'Mismatch: manifests do not point at the current GitHub main commit or its direct parent manifest revision. ' +
                  'Acceptable GitHub main revisions: ' + formatRevisionList(githubMainAcceptableRevisions) + '. ' +
                  'Current site manifest revision: ' + formatRevision(originManifest.gitRevision) + '. ' +
                  'GitHub raw manifest revision: ' + formatRevision(githubManifest.gitRevision) + '. ' +
                  'Matching public gateway manifest revisions: ' + formatRevisionList(matchingGatewayRevisions) + '.'
              );
            } else {
              setStatus('verified', 'Verified: current site, at least one public IPFS gateway, ' + (INCLUDE_GITHUB_VERIFICATION ? 'GitHub raw manifest, current GitHub publication revision, ' : '') + 'every files[] path/byte/hash, and live browser hashes for current-site non-image files match.');
            }
          } catch (error) {
            filesStatusEl.textContent = 'Unable to verify files';
            filesStatusEl.title = error.message;
            setDetailState(filesDetailEl, null);
            logVerificationStep('verification threw', { error: error.message });
            setStatus('error', 'Unable to verify publication: ' + error.message);
          } finally {
            setRecheckButtonDisabled(false);
            logVerificationStep('run complete');
            console.groupEnd();
          }
        }

        verificationEl.addEventListener('toggle', () => {
          setVerificationExpanded(verificationEl.open);
        });
        if (!('open' in document.createElement('details'))) {
          verificationSummaryEl.addEventListener('click', () => {
            setVerificationExpanded(!verificationEl.open);
          });
        }
        gatewayDetailEl.addEventListener('click', openGatewayModal);
        gatewayDetailEl.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openGatewayModal();
          }
        });
        gatewayModalCloseEl.addEventListener('click', closeGatewayModal);
        gatewayModalEl.addEventListener('click', (event) => {
          if (event.target && event.target.hasAttribute('data-ipfs-footer-modal-close')) {
            closeGatewayModal();
          }
        });
        filesDetailEl.addEventListener('click', openFilesModal);
        filesDetailEl.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openFilesModal();
          }
        });
        filesModalCloseEl.addEventListener('click', closeFilesModal);
        filesModalEl.addEventListener('click', (event) => {
          if (event.target && event.target.hasAttribute('data-ipfs-footer-files-modal-close')) {
            closeFilesModal();
          }
        });
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && !gatewayModalEl.hidden) {
            closeGatewayModal();
          } else if (event.key === 'Escape' && !filesModalEl.hidden) {
            closeFilesModal();
          }
        });
        recheckButton.addEventListener('click', () => {
          if (getVerificationDelayRemainingMs() > 0) {
            void scheduleVerificationAfterDelay();
            return;
          }
          runVerification();
        });
        void scheduleVerificationAfterDelay();
      }());
    </script>
  </footer>
`;
}

module.exports = {
  createSharedFooterTemplate,
};
