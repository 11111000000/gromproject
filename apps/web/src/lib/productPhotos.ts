import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const REL_DIR = path.join('public', 'photos-v2');

function resolveDir(): string {
  const candidates = [
    path.resolve(process.cwd(), REL_DIR),
    path.resolve(process.cwd(), 'apps', 'web', REL_DIR),
  ];
  for (const dir of candidates) {
    if (existsSync(dir)) return dir;
  }
  return candidates[0];
}

export function listProductPhotos(sku: string): string[] {
  const dir = resolveDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f === `${sku}.jpg` || new RegExp(`^${sku}-\\d+\\.jpg$`).test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export function listWebpPhotos(): Set<string> {
  const dir = resolveDir();
  if (!existsSync(dir)) return new Set();
  return new Set(readdirSync(dir).filter((f) => f.endsWith('.webp')));
}
