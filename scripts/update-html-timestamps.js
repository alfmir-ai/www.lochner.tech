const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const HTML_FILES = [
  'index.html',
  'alfmir.ai.html',
  'lochner-apparel.html',
];
const TIMESTAMP_COMMENT_PATTERN = /<!-- Unix time \(ms\): \d+ -->/;
const timestampComment = `<!-- Unix time (ms): ${Date.now()} -->`;

for (const relativePath of HTML_FILES) {
  const filePath = path.join(ROOT_DIR, relativePath);
  const html = fs.readFileSync(filePath, 'utf8');

  if (!TIMESTAMP_COMMENT_PATTERN.test(html)) {
    throw new Error(`Missing Unix timestamp comment in ${relativePath}`);
  }

  fs.writeFileSync(filePath, html.replace(TIMESTAMP_COMMENT_PATTERN, timestampComment));
}

console.log(`Updated HTML Unix timestamp comments to ${timestampComment.match(/\d+/)[0]}`);
