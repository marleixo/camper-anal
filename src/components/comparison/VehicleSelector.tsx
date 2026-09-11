'use client';
import { useState } from 'react';
import type { Inspection } from '@/types/inspection';

export default function VehicleSelector({ inspections, selected }: { inspections: Inspection[]; selected: number[] }) {
  const [ids, setIds] = useState(selected);
  function toggle(id: number) { setIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  return <form className="space-y-3" action="/compare" method="get"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{inspections.map((inspection) => <label key={inspection.id} className="flex min-h-14 items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-3"><input type="checkbox" checked={ids.includes(inspection.id)} onChange={() => toggle(inspection.id)} /><span><strong>{inspection.make_model}</strong><small className="block text-[var(--muted)]">{inspection.decision ?? 'Draft'}</small></span></label>)}</div>{ids.map((id) => <input key={id} type="hidden" name="ids" value={id} />)}<button className="min-h-12 rounded-xl bg-[var(--accent)] px-5 font-sans font-bold text-white" type="submit" disabled={ids.length < 2}>{ids.length < 2 ? 'Select at least two' : `Compare ${ids.length} vehicles`}</button></form>;
}