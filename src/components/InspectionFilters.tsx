'use client';
import { useState } from 'react';
import type { Decision, Inspection } from '@/types/inspection';

const priceFormatter = new Intl.NumberFormat('en-US');

export default function InspectionFilters({ inspections, cardsOnly = false, showCards = true }: { inspections: Inspection[]; cardsOnly?: boolean; showCards?: boolean }) {
  const [rating, setRating] = useState<Decision | 'all'>('all');
  const visible = rating === 'all' ? inspections : inspections.filter((item) => item.decision === rating);
  return <>
    {!cardsOnly && <label className="records-filter">Show inspections<select aria-label="Filter inspections by rating" value={rating} onChange={(event) => setRating(event.target.value as Decision | 'all')}><option value="all">All ratings</option><option value="Rejected">Rejected</option><option value="Interesting">Interesting</option><option value="Top Candidate">Top Candidate</option></select></label>}
    {showCards && <div className="records-grid">{visible.map((inspection) => <a key={inspection.id} href={`/inspections/${inspection.id}`} className="record-card"><div className="record-placeholder">{inspection.camper_photo_path ? <img className="h-40 w-full object-cover" src={`/api/photos/${inspection.id}/${inspection.camper_photo_path.split('/').pop()}`} alt="Camper" /> : <span className="font-sans text-sm font-bold uppercase tracking-[.18em] text-[var(--muted)]">No vehicle photo</span>}</div><div className="record-body"><div className="record-topline"><h2 className="record-title">{inspection.make_model}</h2><span className="record-status">{inspection.decision ?? 'Draft'}</span></div><div className="record-price"><span>Asking price</span><strong>€{priceFormatter.format(Number(inspection.asking_price))}</strong></div></div></a>)}</div>}
    {visible.length === 0 && <p className="rounded-xl bg-[var(--soft)] p-4">No inspections match that rating.</p>}
  </>;
}
