'use server';
import { addCustomParameter, deleteCustomParameter } from '@/lib/db/queries/customParameters';
import { updateInspection } from '@/lib/db/queries/inspections';
import { revalidatePath } from 'next/cache';

const booleanFields = new Set(['is_automatic', 'has_all_terrain_tires', 'has_cab_blackout', 'has_double_floor', 'has_flush_windows', 'has_maxxfan', 'has_air_conditioned', 'has_mppt', 'has_inverter_bypass', 'is_grey_tank_insulated', 'has_shurflo_pump', 'has_water_filter', 'has_12v_ac', 'has_duocontrol', 'has_gpl_tank', 'has_double_hinge_door', 'has_induction_cooktop', 'has_sog', 'has_froli', 'garage_fits_motorcycle', 'has_garage_rails', 'has_outdoor_shower', 'has_awning_led']);
const numericFields = new Set(['asking_price', 'trade_in_offer', 'payload_capacity_kg', 'battery_ah', 'dcdc_charger_amps', 'solar_watts', 'inverter_watts', 'fresh_water_liters', 'grey_water_liters', 'fridge_liters', 'final_score']);

export async function saveInspection(id: number, formData: FormData) {
  const values: Record<string, string | number | null> = {};
  for (const [key, value] of formData.entries()) {
    if (key === 'custom_label' || key === 'custom_value' || key === 'custom_category') continue;
    if (booleanFields.has(key)) values[key] = value === 'on' ? 1 : 0;
    else if (numericFields.has(key)) values[key] = value === '' ? null : Number(value);
    else values[key] = String(value);
  }
  for (const field of booleanFields) if (!formData.has(field)) values[field] = 0;
  updateInspection(id, values);
  const label = String(formData.get('custom_label') ?? '').trim();
  const customValue = String(formData.get('custom_value') ?? '').trim();
  const category = String(formData.get('custom_category') ?? '');
  if (label && customValue && category) addCustomParameter(id, category, label, customValue);
  revalidatePath(`/inspections/${id}`); revalidatePath('/');
}

export async function removeCustomParameter(id: number, inspectionId: number) { deleteCustomParameter(id); revalidatePath(`/inspections/${inspectionId}`); }