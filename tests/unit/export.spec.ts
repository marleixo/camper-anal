import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { closeDatabase, getDatabase } from '@/lib/db/client';
import { migrate } from '@/lib/db/migrate';
import { createInspection } from '@/lib/db/queries/inspections';
import { toCsv } from '@/lib/export/toCsv';
import { toJson } from '@/lib/export/toJson';

describe('inspection exports', () => {
  beforeEach(() => { migrate(); getDatabase().prepare('DELETE FROM inspections').run(); });
  afterEach(() => closeDatabase());

  it('exports an empty JSON snapshot and CSV header', () => {
    expect(JSON.parse(toJson()).inspections).toEqual([]);
    expect(toCsv().split('\n')[0]).toContain('make_model');
  });

  it('includes saved inspections in both formats', () => {
    createInspection({ make_model: 'Test Camper', asking_price: 42000, chassis_type: 'Other', length_category: '<6m', payload_capacity_kg: 35 });
    expect(toJson()).toContain('Test Camper');
    expect(toCsv()).toContain('Test Camper');
  });
});