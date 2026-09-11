import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const databasePath = process.env.DATABASE_PATH ?? join(process.env.DATA_DIR ?? join(process.cwd(), 'data'), 'app.db');
let database: DatabaseSync | undefined;

export function getDatabase(): DatabaseSync {
  if (!database) {
    mkdirSync(dirname(databasePath), { recursive: true });
    database = new DatabaseSync(databasePath);
    database.exec('PRAGMA foreign_keys = ON');
  }
  return database;
}

export function closeDatabase() {
  database?.close();
  database = undefined;
}