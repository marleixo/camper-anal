import type { CategoryProgress } from '@/lib/inspection/progress';

const labels: Record<CategoryProgress, string> = {
  'not-started': 'Not started',
  'partially-answered': 'In progress',
  'all-visible-questions-answered': 'Reviewed',
};

export default function CategoryProgressBadge({ progress }: { progress: CategoryProgress }) {
  return <span className={`inline-flex min-h-8 items-center rounded-full border px-3 py-1 font-sans text-xs font-bold ${progress === 'all-visible-questions-answered' ? 'border-[#a8c7af] bg-[#edf8ee] text-[#376542]' : progress === 'partially-answered' ? 'border-[#e4c788] bg-[#fff8e7] text-[#76591c]' : 'border-[var(--line)] bg-white text-[var(--muted)]'}`}><span aria-hidden="true" className="mr-2">{progress === 'all-visible-questions-answered' ? '✓' : progress === 'partially-answered' ? '•' : '○'}</span>{labels[progress]}</span>;
}