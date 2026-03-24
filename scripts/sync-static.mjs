import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(rootDir, 'docs');
const destinationDir = path.join(rootDir, 'public', 'docs');

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  const nestedEntries = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectFiles(entryPath);
      }

      if (entry.isFile()) {
        return [entryPath];
      }

      return [];
    })
  );

  return nestedEntries.flat();
}

async function syncDocsDirectory() {
  await mkdir(destinationDir, { recursive: true });

  const files = await collectFiles(sourceDir);

  await Promise.all(
    files.map(async (sourcePath) => {
      const relativePath = path.relative(sourceDir, sourcePath);
      const destinationPath = path.join(destinationDir, relativePath);
      await mkdir(path.dirname(destinationPath), { recursive: true });
      await copyFile(sourcePath, destinationPath);
      console.log(`Synced ${path.relative(rootDir, sourcePath)} -> ${path.relative(rootDir, destinationPath)}`);
    })
  );
}

syncDocsDirectory().catch((error) => {
  console.error('Failed to sync static docs.', error);
  process.exitCode = 1;
});
