'use client';
import { useEffect, useRef, useState } from 'react';
import type { InspectionBundle } from '@/types/inspection';
import { saveInspection } from '@/app/inspections/[id]/actions';
import DrivetrainCategory from './DrivetrainCategory';
import StructureCategory from './StructureCategory';
import ElectricalCategory from './ElectricalCategory';
import HydraulicsCategory from './HydraulicsCategory';
import ClimateCategory from './ClimateCategory';
import KitchenCategory from './KitchenCategory';
import BathroomCategory from './BathroomCategory';
import GarageCategory from './GarageCategory';
import CustomParameterField from './CustomParameterField';
import DecisionSection from './DecisionSection';
import CategoryPhotoUploader from '@/components/photos/CategoryPhotoUploader';
import GeneralPhotoSlot from '@/components/photos/GeneralPhotoSlot';

const categoryComponents = [
  ['drivetrain', DrivetrainCategory], ['structure', StructureCategory], ['electrical', ElectricalCategory], ['hydraulics', HydraulicsCategory],
  ['climate', ClimateCategory], ['kitchen', KitchenCategory], ['bathroom', BathroomCategory], ['garage', GarageCategory],
] as const;

export default function InspectionForm({ inspection }: { inspection: InspectionBundle }) {
  const [saved, setSaved] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const draftKey = `inspection-draft-${inspection.id}`;
  useEffect(() => {
    const draft = localStorage.getItem(draftKey);
    if (!draft || !formRef.current) return;
    const values = JSON.parse(draft) as Record<string, string>;
    for (const [name, value] of Object.entries(values)) {
      const field = formRef.current.elements.namedItem(name);
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
        if (field instanceof HTMLInputElement && field.type === 'checkbox') field.checked = value === 'on'; else field.value = value;
      }
    }
  }, [draftKey]);
  function retainDraft() {
    if (!formRef.current) return;
    const values: Record<string, string> = {};
    for (const [key, value] of new FormData(formRef.current).entries()) if (typeof value === 'string') values[key] = value;
    localStorage.setItem(draftKey, JSON.stringify(values));
  }
  return <form ref={formRef} onChange={retainDraft} action={async (data) => { await saveInspection(inspection.id, data); localStorage.removeItem(draftKey); setSaved(true); window.setTimeout(() => setSaved(false), 2000); }} className="space-y-5">
    <section className="grid gap-3 rounded-2xl bg-[var(--panel)] p-4 shadow-sm sm:grid-cols-2"><h2 className="sm:col-span-2 text-2xl font-bold">Vehicle details</h2><label>Make / model<input required name="make_model" defaultValue={inspection.make_model} /></label><label>Asking price<input required name="asking_price" type="number" step="0.01" defaultValue={String(inspection.asking_price)} /></label><label>Trade-in offer<input name="trade_in_offer" type="number" step="0.01" defaultValue={String(inspection.trade_in_offer ?? '')} /></label><label>Chassis<select name="chassis_type" defaultValue={String(inspection.chassis_type)}><option>Ducato</option><option>Sprinter</option><option>MAN/Crafter</option><option>Other</option></select></label><label>Length<select name="length_category" defaultValue={String(inspection.length_category)}><option>&lt;6m</option><option>6m-6.4m</option><option>7m</option><option>7.3m+</option></select></label><label>Payload<select name="payload_capacity_kg" defaultValue={String(inspection.payload_capacity_kg)}><option>35</option><option>42</option><option>45</option><option>50</option></select></label></section>
    <div className="grid gap-4 lg:grid-cols-2">{categoryComponents.map(([category, Component]) => <Component key={category} values={inspection}><CategoryPhotoUploader inspectionId={inspection.id} category={category} initialPhotos={inspection.category_photos.filter((photo) => photo.category === category)} /><CustomParameterField category={category} /></Component>)}</div>
    <DecisionSection values={inspection} />
    <section className="grid gap-3 sm:grid-cols-2"><GeneralPhotoSlot inspectionId={inspection.id} label="Camper photo" slot="camper" initialPath={inspection.camper_photo_path as string} /><GeneralPhotoSlot inspectionId={inspection.id} label="Price / board photo" slot="price_board" initialPath={inspection.price_board_photo_path as string} /></section>
    {saved && <p className="rounded-xl bg-[var(--soft)] p-3 text-center font-sans text-sm">Saved to the shared inspection book.</p>}
  </form>;
}
