export type CategoryProgress = 'not-started' | 'partially-answered' | 'all-visible-questions-answered';

export function isSet(value: unknown) { return value !== null && value !== undefined && value !== ''; }

export function getCategoryProgress(values: Record<string, unknown>, fields: string[]): CategoryProgress {
  const answerableFields = fields.filter((field) => !field.startsWith('has_') && !field.startsWith('is_') && !field.startsWith('garage_fits_'));
  const answered = answerableFields.filter((field) => isSet(values[field])).length;
  if (answered === 0) return 'not-started';
  if (answered === answerableFields.length) return 'all-visible-questions-answered';
  return 'partially-answered';
}