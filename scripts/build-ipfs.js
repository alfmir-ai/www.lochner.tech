const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist-ipfs');
const { MANIFEST_PATH, createIpfsVersionManifest, serializeManifest } = require('./ipfs-version-manifest');
const { HTML_FILES, STATIC_DIRS, STATIC_FILES, prepareHtmlForIpfs } = require('./ipfs-site-rendering');

function main() {
  const sourceManifest = readSourceManifest();

  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const dir of STATIC_DIRS) {
    copyPath(path.join(ROOT_DIR, dir), path.join(OUTPUT_DIR, dir));
  }

  for (const file of STATIC_FILES) {
    copyPath(path.join(ROOT_DIR, file), path.join(OUTPUT_DIR, file));
  }

  for (const file of HTML_FILES) {
    const source = path.join(ROOT_DIR, file);
    const destination = path.join(OUTPUT_DIR, file);
    const html = fs.readFileSync(source, 'utf8');
    fs.writeFileSync(destination, prepareHtmlForIpfs(html, {
      includeGithub: sourceManifest && sourceManifest.includeGithubVerification === true,
    }));
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, MANIFEST_PATH),
    serializeManifest(createIpfsVersionManifest(
      OUTPUT_DIR,
      sourceManifest
        ? {
            gitRevision: sourceManifest.gitRevision,
            gitRevisionDirty: sourceManifest.gitRevisionDirty,
            includeGithubVerification: sourceManifest.includeGithubVerification === true,
          }
        : {}
    ))
  );

  fs.mkdirSync(path.join(OUTPUT_DIR, 'lochner-apparel'), { recursive: true });
  fs.copyFileSync(
    path.join(OUTPUT_DIR, 'lochner-apparel.html'),
    path.join(OUTPUT_DIR, 'lochner-apparel', 'index.html')
  );

  // fs.mkdirSync(path.join(OUTPUT_DIR, 'lochner-soaps'), { recursive: true });
  // fs.copyFileSync(
  //   path.join(OUTPUT_DIR, 'lochner-soaps.html'),
  //   path.join(OUTPUT_DIR, 'lochner-soaps', 'index.html')
  // );

  console.log(`IPFS-ready static site written to ${path.relative(ROOT_DIR, OUTPUT_DIR)}`);
}

function copyPath(source, destination) {
  fs.cpSync(source, destination, { recursive: true });
}

function readSourceManifest() {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT_DIR, MANIFEST_PATH), 'utf8'));
  } catch {
    return null;
  }
}

main();
