export function fieldState(value: unknown) { return value === null || value === undefined || value === '' ? 'unset' : 'set'; }

export default function FieldState({ value, boolean }: { value: unknown; boolean?: boolean }) {
  if (boolean) return <span className="font-sans text-xs font-bold text-[var(--muted)]">{value ? 'Yes' : 'No'}</span>;
  return <span className="font-sans text-xs font-bold uppercase tracking-wide text-[var(--muted)]">{fieldState(value) === 'unset' ? 'Not set' : 'Answered'}</span>;
}