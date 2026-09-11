import { mkdir, rm, writeFile } from 'node:fs/promises';
import { basename, join, relative, resolve } from 'node:path';

const root = join(process.env.DATA_DIR ?? join(process.cwd(), 'data'), 'photos');
export async function savePhoto(inspectionId: number, fileName: string, bytes: Buffer, category?: string) {
  const directory = join(root, String(inspectionId));
  await mkdir(directory, { recursive: true });
  const safeName = `${category ? `${category}-` : ''}${Date.now()}-${basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '-')}`;
  await writeFile(join(directory, safeName), bytes);
  return relative(root, join(directory, safeName));
}

export async function deletePhoto(filePath: string) {
  const target = resolve(root, filePath);
  if (!target.startsWith(`${resolve(root)}${process.platform === 'win32' ? '\\' : '/'}`)) throw new Error('Invalid photo path');
  await rm(target, { force: true });
}