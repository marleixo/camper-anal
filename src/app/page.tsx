import { listInspections } from '@/lib/db/queries/inspections';
import InspectionFilters from '@/components/InspectionFilters';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  const inspections = listInspections();
  return <div className="space-y-10">
    <section className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
      <div>
        <p className="eyebrow">Your field notebook</p>
        <h1 className="display-title mt-3 max-w-3xl">Make the next camper easier to choose.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">Keep every detail, impression, and comparison in one calm place while you walk the vehicle.</p>
      </div>
      <div className="surface notebook-panel">
        <div className="notebook-meta"><span className="eyebrow">This notebook</span><span className="rounded-full bg-[var(--soft)] px-3 py-1 font-sans text-xs font-bold">{inspections.length} records</span></div>
        <div className="notebook-actions"><Link className="notebook-action notebook-action-primary" href="/inspections/new">Start inspection <span aria-hidden="true" className="ml-2">↗</span></Link><Link className="notebook-action notebook-action-secondary" href="/compare">Compare</Link></div>
        <div className="notebook-exports"><a className="notebook-export" href="/api/export?format=json">Download JSON</a><a className="notebook-export" href="/api/export?format=csv">Download CSV</a></div>
      </div>
    </section>
    {inspections.length === 0 ? <div className="surface p-10 text-center"><h2 className="text-2xl font-bold">No campers logged yet</h2><p className="mt-2 text-[var(--muted)]">Your first inspection can start with the vehicle in front of you.</p></div> : <section className="space-y-5"><div className="records-heading"><div><p className="eyebrow">Inspection library</p><h2 className="mt-1 text-2xl font-bold">Your inspections</h2></div><InspectionFilters inspections={inspections} showCards={false} /></div><div className="records-grid"><InspectionFilters inspections={inspections} cardsOnly /></div></section>}
  </div>;
}
