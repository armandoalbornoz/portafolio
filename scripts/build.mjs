import {copyFile, mkdir, readFile, readdir, realpath, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const files = JSON.parse(await readFile(path.join(root, 'site-files.json'), 'utf8'));
if (!Array.isArray(files) || new Set(files).size !== files.length) throw Error('Invalid site manifest');
for (const file of files) {
  if (typeof file !== 'string' || path.isAbsolute(file) || file.split('/').includes('..')) throw Error('Unsafe asset path');
  const resolved = await realpath(path.join(root, file));
  if (!resolved.startsWith(root + path.sep)) throw Error('Asset outside repository');
}
for (const file of await readdir(root)) {
  if (file.endsWith('.js')) execFileSync(process.execPath, ['--check', path.join(root, file)]);
}
if (process.argv.includes('--check')) {
  console.log(`Checked JavaScript syntax and ${files.length} publishing files.`);
} else {
  let index = await readFile(path.join(root, 'index.html'), 'utf8');
  if (process.env.SITE_URL) {
    const url = new URL(process.env.SITE_URL.replace(/\/$/, '') + '/');
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) throw Error('SITE_URL must be a public HTTPS root URL');
    const escaped = url.href.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
    index = index.replace('content="assets/social-preview.jpg"', `content="${escaped}assets/social-preview.jpg"`)
      .replace('</head>', `  <link rel="canonical" href="${escaped}">\n  <meta property="og:url" content="${escaped}">\n</head>`);
  }
  const out = path.join(root, 'dist');
  if (path.dirname(out) !== root || path.basename(out) !== 'dist') throw Error('Unsafe build directory');
  try { if (await realpath(out) !== out) throw Error('Build directory must not be a symlink'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await rm(out, {recursive: true, force: true});
  for (const file of files) {
    const target = path.join(out, file);
    await mkdir(path.dirname(target), {recursive: true});
    await copyFile(path.join(root, file), target);
  }
  await writeFile(path.join(out, 'index.html'), index);
  console.log(`Built ${files.length} files in dist/; no package installation required.`);
}
