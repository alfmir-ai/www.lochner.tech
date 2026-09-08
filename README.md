This code is unlicensed and may not be used for commercial purposes. You may use it as a technical reference. 

Copyright (c) 2022-2026 Nicholas Jean Lochner, a/k/a Nichole Lochner

# lochner.tech static site host

This repository includes a Node.js server to host the static website files over both HTTP and HTTPS.

# IPFS Deployment

After merging the desired changes into `main`, perform these three steps in order.

## 1. Prepare the release on your development machine

Run:

```bash
npm run ipfs:prepare
```

This command requires a clean working tree. It pulls the current branch with
`--ff-only`, generates and stages `ipfs-version.json`, commits the manifest when
it changed, and pushes the current branch. The manifest intentionally records
the commit immediately before its own manifest-only commit, which is supported
by the frontend verification flow.

## 2. Publish from the IPFS host

On the host containing the production `lochner-tech` IPNS key, pull the manifest
commit and publish the updated site:

```bash
git pull && npm run ipfs:update
```

## 3. Start the IPFS daemon on the VPS proxy server

SSH into the VPS proxy server, start a named `screen` session, and run the IPFS
daemon inside it:

```bash
screen -S ipfs
ipfs daemon
```

Detach from the running screen without stopping the daemon by pressing
<kbd>Ctrl</kbd>+<kbd>A</kbd>, then <kbd>D</kbd>. To reconnect later, run:

```bash
screen -r ipfs
```

With the daemon running, confirm that the production IPNS content resolves and
downloads:

```bash
ipfs name resolve --nocache k2k4r8jw4dtnalpkgklrqeflhsgderg6a8wn5lix7bww1yjemm0rx7ye && ipfs get --progress /ipns/k2k4r8jw4dtnalpkgklrqeflhsgderg6a8wn5lix7bww1yjemm0rx7ye
/ipfs/bafybeiaa5aku4jpgtnxgdtcv3kfgwhemuitohfrizs5bnpna27rcwglk2a
Saving file(s) to k2k4r8jw4dtnalpkgklrqeflhsgderg6a8wn5lix7bww1yjemm0rx7ye
3.72 MiB / 3.72 MiB [---------------------------------------------------------------------------------------------------------------------------------------] 11.76 MiB/s 100.00% 500ms
```

### Fix a gateway timeout for a subpage

If the home page works but a subpage returns `504 Gateway Timeout` with `no
providers found for the CID (phase: provider discovery)`, restart the IPFS
daemon on the VPS proxy server. Reconnect to its screen and stop the daemon with
<kbd>Ctrl</kbd>+<kbd>C</kbd>:

```bash
screen -r ipfs
```

Then start it again in that screen:

```bash
ipfs daemon
```

After the daemon has restarted, open another SSH session to the VPS proxy and
resolve and download the production IPNS content without using the cached IPNS
record:

```console
$ ipfs name resolve --nocache k2k4r8jw4dtnalpkgklrqeflhsgderg6a8wn5lix7bww1yjemm0rx7ye && ipfs get --progress /ipns/k2k4r8jw4dtnalpkgklrqeflhsgderg6a8wn5lix7bww1yjemm0rx7ye
/ipfs/bafybeibevfqiqcbkzdl7x2ehqqegfhdvlcikllqnkwf7yshsj4n5xburnu
Saving file(s) to k2k4r8jw4dtnalpkgklrqeflhsgderg6a8wn5lix7bww1yjemm0rx7ye
3.74 MiB / 3.74 MiB [---------------------------------------------------------------------------------------------------------------------------------------] 17.94 MiB/s 100.00% 400ms
```

The resolved CID and download size will change between releases. A completed
`ipfs get` confirms that the restarted daemon can retrieve the entire site.
Detach the daemon screen with <kbd>Ctrl</kbd>+<kbd>A</kbd>, then <kbd>D</kbd>, and
reload the failed subpage. Restarting the daemon and completing this uncached
resolve/download is the normal fix for the subpage provider discovery timeout;
repinning or republishing the site is not required first.

## Certificate configuration

The server is configured with hardcoded certbot paths and serves both domains simultaneously via SNI:

- `lochner.tech`
  - `/etc/letsencrypt/live/lochner.tech/privkey.pem`
  - `/etc/letsencrypt/live/lochner.tech/fullchain.pem`
- `www.lochner.tech`
  - `/etc/letsencrypt/live/www.lochner.tech/privkey.pem`
  - `/etc/letsencrypt/live/www.lochner.tech/fullchain.pem`

If your cert paths change, update `TLS_CERTIFICATES` in `server.js`.

## Run

```bash
npm start
```

The server will:
- Redirect all HTTP requests on port `80` to HTTPS
- Serve the site on port `443` (HTTPS)
- Select the correct certificate for `lochner.tech` and `www.lochner.tech` using SNI

## Build for IPFS

IPFS gateways commonly serve sites from a path like `/ipfs/<CID>/`, so absolute site-root URLs such as `/assets/...` can point at the gateway root instead of this site. Generate an IPFS-ready bundle before publishing:

```bash
npm run export:ipfs
```

The command writes a self-contained `dist-ipfs/` directory that:
- Copies the static assets and images needed by the site
- Renders the shared header and footer into each HTML file, so the Node.js server is not required
- Rewrites root-relative local asset references to relative paths for gateway compatibility
- Writes `ipfs-version.json`, a deterministic content manifest with the domain name, configured IPFS/IPNS ID, Git revision, GitHub commit URL, and a version hash for every published HTML file and every file recursively discovered in the published static directories. Newly added assets are therefore included automatically in both `ipfs:prepare` and the bundle created by `ipfs:publish`.
- Adds `lochner-apparel/index.html` so the `/lochner-apparel` route alias also works as a directory-style IPFS path

Publish the generated directory with your IPFS client or pinning service, or use one of the included helper scripts.

For a first publish, run:

```bash
npm run ipfs:publish
```

That script builds `dist-ipfs/`, adds it to IPFS with CIDv1, pins the CID, creates the `lochner-tech` IPNS key if needed, and publishes the CID to that IPNS name.

For production updates after the key already exists, run:

```bash
npm run ipfs:update
```

The update script refuses to create a new key and is hardcoded to expect the production IPNS ID by default. To publish with a different key, explicitly override `LOCHNER_EXPECTED_IPNS_ID`:

```bash
LOCHNER_EXPECTED_IPNS_ID=<alternate-ipns-id> npm run ipfs:update
```

Both scripts support `LOCHNER_IPNS_KEY_NAME` to override the default `lochner-tech` key name. The IPFS version manifest always includes `domainName: "lochner.tech"` and defaults `ipnsId` to `k2k4r8jw4dtnalpkgklrqeflhsgderg6a8wn5lix7bww1yjemm0rx7ye`; set `LOCHNER_IPNS_ID` or `LOCHNER_EXPECTED_IPNS_ID` to override the IPNS ID when generating a manifest for a different key. The scripts also support `IPFS_BIN`, `IPFS_HOME`, and `IPFS_PATH` for Kubo/IPFS installations that are not on `PATH`.

## Frontend IPFS version verification

Every `lochner.tech` page includes a browser-side verification footer that compares the current site's manifest and live non-image file hashes with public IPFS/IPNS gateway manifests. By default, it also verifies the GitHub raw manifest and current `main` commit. The generated manifest records that choice so later IPFS builds render the same verifier.

Generate, commit, and push the root manifest before publishing:

```bash
npm run ipfs:prepare
```

To explicitly disable GitHub verification for a prepared release, run:

```bash
IPFS_VERIFIER_INCLUDE_GITHUB=false npm run ipfs:prepare
```
