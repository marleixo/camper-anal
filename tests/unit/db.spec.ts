import { afterEach, describe, expect, it } from 'vitest';
import { closeDatabase, getDatabase } from '@/lib/db/client';
import { migrate } from '@/lib/db/migrate';

describe('database migrations', () => {
  afterEach(() => closeDatabase());

  it('creates the inspection schema at version one', () => {
    migrate();
    expect(getDatabase().prepare('PRAGMA user_version').get()).toMatchObject({ user_version: 1 });
    expect(getDatabase().prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all()).toEqual(expect.arrayContaining([{ name: 'inspections' }]));
  });
});