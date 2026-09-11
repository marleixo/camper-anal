import { notFound } from 'next/navigation';
import { getInspection } from '@/lib/db/queries/inspections';
import InspectionForm from '@/components/checklist/InspectionForm';
export const dynamic = 'force-dynamic';
export default async function InspectionPage({ params }: { params: Promise<{ id: string }> }) { const inspection = getInspection(Number((await params).id)); if (!inspection) notFound(); return <div className="space-y-5"><div><p className="font-sans text-sm uppercase tracking-[0.2em] text-[var(--accent-dark)]">Inspection #{inspection.id}</p><h1 className="text-4xl font-bold">{inspection.make_model}</h1></div><InspectionForm inspection={inspection} /></div>; }