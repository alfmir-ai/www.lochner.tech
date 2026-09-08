const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const MANIFEST_PATH = 'ipfs-version.json';
const GITHUB_REPOSITORY_URL = 'https://github.com/alfmir-ai/www.lochner.tech';
const DOMAIN_NAME = 'lochner.tech';
const IPNS_ID = process.env.LOCHNER_IPNS_ID || process.env.LOCHNER_EXPECTED_IPNS_ID || 'k2k4r8jw4dtnalpkgklrqeflhsgderg6a8wn5lix7bww1yjemm0rx7ye';
const MAX_PREVIOUS_CONTENT_SHA256 = 2;
const { HTML_FILES, STATIC_DIRS, STATIC_FILES } = require('./ipfs-site-rendering');

function getContentPaths(rootDir) {
  const paths = [...HTML_FILES, ...STATIC_FILES];

  for (const staticDir of STATIC_DIRS) {
    collectFiles(rootDir, staticDir, paths);
  }

  return [...new Set(paths)].sort();
}

function collectFiles(rootDir, relativePath, paths) {
  const absolutePath = path.join(rootDir, relativePath);

  for (const entry of fs.readdirSync(absolutePath, { withFileTypes: true })) {
    const childPath = path.posix.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      collectFiles(rootDir, childPath, paths);
    } else if (entry.isFile()) {
      paths.push(childPath);
    }
  }
}

function createIpfsVersionManifest(rootDir, options = {}) {
  const gitRevision = Object.prototype.hasOwnProperty.call(options, 'gitRevision')
    ? options.gitRevision
    : resolveGitRevision(rootDir);
  const gitRevisionDirty = Object.prototype.hasOwnProperty.call(options, 'gitRevisionDirty')
    ? options.gitRevisionDirty
    : resolveGitRevisionDirty(rootDir);
  const readFile = typeof options.readFile === 'function'
    ? options.readFile
    : (relativePath) => fs.readFileSync(path.join(rootDir, relativePath));
  const files = getContentPaths(rootDir).map((relativePath) => {
    const data = Buffer.from(readFile(relativePath));

    return {
      path: relativePath,
      bytes: data.length,
      sha256: crypto.createHash('sha256').update(data).digest('hex'),
    };
  });

  const contentHash = crypto.createHash('sha256');
  for (const file of files) {
    contentHash.update(`${file.path}\0${file.bytes}\0${file.sha256}\n`);
  }

  const contentSha256 = contentHash.digest('hex');

  return {
    schemaVersion: 1,
    project: DOMAIN_NAME,
    domainName: DOMAIN_NAME,
    ipnsId: IPNS_ID,
    source: 'https://lochner.tech',
    manifestPath: MANIFEST_PATH,
    gitRevision,
    gitRevisionDirty,
    gitRepositoryUrl: GITHUB_REPOSITORY_URL,
    gitCommitUrl: gitRevision ? `${GITHUB_REPOSITORY_URL}/commit/${gitRevision}` : null,
    gitTreeUrl: gitRevision ? `${GITHUB_REPOSITORY_URL}/tree/${gitRevision}` : null,
    includeGithubVerification: options.includeGithubVerification === true,
    contentSha256,
    previousContentSha256: resolvePreviousContentSha256(rootDir, contentSha256),
    files,
  };
}

function resolvePreviousContentSha256(rootDir, contentSha256) {
  const existingManifest = readExistingManifest(rootDir);
  const previousHashes = [];

  if (existingManifest) {
    if (Array.isArray(existingManifest.previousContentSha256)) {
      previousHashes.push(...existingManifest.previousContentSha256);
    }

    if (typeof existingManifest.contentSha256 === 'string') {
      previousHashes.push(existingManifest.contentSha256);
    }
  }

  return [...new Set(previousHashes)]
    .filter((hash) => isSha256(hash) && hash !== contentSha256)
    .slice(-MAX_PREVIOUS_CONTENT_SHA256);
}

function readExistingManifest(rootDir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(rootDir, MANIFEST_PATH), 'utf8'));
  } catch {
    return null;
  }
}

function isSha256(value) {
  return typeof value === 'string' && /^[a-f0-9]{64}$/i.test(value);
}

function resolveGitRevision(rootDir) {
  if (process.env.LOCHNER_GIT_REVISION) {
    return process.env.LOCHNER_GIT_REVISION.trim();
  }

  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

function resolveGitRevisionDirty(rootDir) {
  if (process.env.LOCHNER_GIT_REVISION_DIRTY) {
    return process.env.LOCHNER_GIT_REVISION_DIRTY.trim() === 'true';
  }

  try {
    const status = execFileSync('git', ['status', '--short'], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return status.length > 0;
  } catch {
    return null;
  }
}

function serializeManifest(manifest) {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

module.exports = {
  DOMAIN_NAME,
  GITHUB_REPOSITORY_URL,
  IPNS_ID,
  MANIFEST_PATH,
  MAX_PREVIOUS_CONTENT_SHA256,
  createIpfsVersionManifest,
  getContentPaths,
  resolvePreviousContentSha256,
  serializeManifest,
};
