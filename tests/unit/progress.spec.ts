import { describe, expect, it } from 'vitest';
import { getCategoryProgress } from '@/lib/inspection/progress';

describe('category progress', () => {
  const fields = ['drivetrain_type', 'battery_type', 'fresh_water_liters'];
  it('identifies untouched, partial, and reviewed categories', () => {
    expect(getCategoryProgress({}, fields)).toBe('not-started');
    expect(getCategoryProgress({ drivetrain_type: '4x4' }, fields)).toBe('partially-answered');
    expect(getCategoryProgress({ drivetrain_type: '4x4', battery_type: 'AGM', fresh_water_liters: 120 }, fields)).toBe('all-visible-questions-answered');
  });
});
