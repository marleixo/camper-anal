'use client';
import { useState } from 'react';
import type { Inspection } from '@/types/inspection';

export default function VehicleSelector({ inspections, selected }: { inspections: Inspection[]; selected: number[] }) {
  const [ids, setIds] = useState(selected);
  function toggle(id: number) { setIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  return <form className="vehicle-selector" action="/compare" method="get"><div className="vehicle-grid">{inspections.map((inspection) => <label key={inspection.id} className="vehicle-row"><input type="checkbox" checked={ids.includes(inspection.id)} onChange={() => toggle(inspection.id)} /><span className="vehicle-row-copy"><strong className="vehicle-row-name">{inspection.make_model}</strong><small className="vehicle-row-state">{String(inspection.decision ?? 'Draft')}</small></span></label>)}</div>{ids.map((id) => <input key={id} type="hidden" name="ids" value={id} />)}<button className="compare-submit" type="submit" disabled={ids.length < 2}>{ids.length < 2 ? 'Select two or more vehicles' : `Compare ${ids.length} vehicles`}</button></form>;
}
