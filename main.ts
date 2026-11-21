// Leonida Trophy Guide — the entry program (Node 22, standard library only).
//
// The guide itself is app/: plain static files (index.html + app.js + style.css
// + data/trophies.json + data/roadmap.json), no build step, fully offline.
// This program hands the entry in: it copies app/ and screenshots/ from this
// directory into the output directory and writes dossier.json there, using the
// vendored make.fun library. The scorer rebuilds the dossier with its own copy
// of that library and requires a byte-for-byte match, so vendor/ stays untouched.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader the output directory is /output.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Where this file lives, and where the entry goes.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy the guide and its screenshots into the output directory.
mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// Write the dossier with the same caps the gate enforces: at most 160 KiB of
// source text, at most 4 screenshots of at most 256 KiB each, at most 993
// files/directories and 48 MiB in app/ (the output's own cap is 1000 entries
// and 64 MiB, shared by app/, screenshots/ and dossier.json).
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
