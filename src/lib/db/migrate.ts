import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getDatabase } from './client';

export function migrate(database = getDatabase()) {
  const migrationDirectory = join(process.cwd(), 'src/lib/migrations');
  const migrations = readdirSync(migrationDirectory).filter((file) => /^\d+_.+\.sql$/.test(file)).sort();
  const currentVersion = Number(database.prepare('PRAGMA user_version').get()?.user_version ?? 0);
  for (const file of migrations) {
    const version = Number(file.split('_')[0]);
    if (version <= currentVersion) continue;
    const sql = readFileSync(join(migrationDirectory, file), 'utf8');
    database.exec('BEGIN');
    try {
      database.exec(sql);
      database.exec(`PRAGMA user_version = ${version}`);
      database.exec('COMMIT');
    } catch (error) {
      database.exec('ROLLBACK');
      throw error;
    }
  }
}