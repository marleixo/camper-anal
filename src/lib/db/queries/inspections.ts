import { getDatabase } from '../client';
import type { Decision, Inspection, InspectionInput, InspectionBundle } from '@/types/inspection';

const columns = ['make_model', 'asking_price', 'trade_in_offer', 'chassis_type', 'length_category', 'payload_capacity_kg', 'drivetrain_type', 'is_automatic', 'has_all_terrain_tires', 'has_cab_blackout', 'notes_drivetrain', 'has_double_floor', 'has_flush_windows', 'has_maxxfan', 'has_air_conditioned', 'notes_structure', 'battery_type', 'battery_ah', 'dcdc_charger_amps', 'solar_watts', 'has_mppt', 'inverter_watts', 'has_inverter_bypass', 'notes_electrical', 'fresh_water_liters', 'grey_water_liters', 'is_grey_tank_insulated', 'has_shurflo_pump', 'has_water_filter', 'notes_hydraulics', 'heating_type', 'has_12v_ac', 'has_duocontrol', 'has_gpl_tank', 'notes_climate', 'fridge_type', 'fridge_liters', 'has_double_hinge_door', 'has_induction_cooktop', 'notes_kitchen', 'bathroom_type', 'toilet_type', 'has_sog', 'bed_layout', 'has_froli', 'notes_bathroom', 'garage_fits_motorcycle', 'has_garage_rails', 'has_outdoor_shower', 'has_awning_led', 'notes_garage', 'pros_summary', 'cons_summary', 'decision', 'final_score', 'camper_photo_path', 'price_board_photo_path'] as const;

type DatabaseValue = string | number | null;
function values(input: InspectionInput): DatabaseValue[] { return columns.map((column) => (input[column] as DatabaseValue | undefined) ?? null); }

export function createInspection(input: InspectionInput) {
  if (input.final_score != null && (Number(input.final_score) < 1 || Number(input.final_score) > 10)) throw new Error('Final score must be between 1 and 10');
  const now = new Date().toISOString();
  const database = getDatabase();
  const result = database.prepare(`INSERT INTO inspections (created_at, updated_at, ${columns.join(', ')}) VALUES (?, ?, ${columns.map(() => '?').join(', ')})`).run(now, now, ...values(input));
  return Number(result.lastInsertRowid);
}

export function getInspection(id: number): InspectionBundle | null {
  const database = getDatabase();
  const inspection = database.prepare('SELECT * FROM inspections WHERE id = ?').get(id) as Inspection | undefined;
  if (!inspection) return null;
  const custom_parameters = database.prepare('SELECT * FROM custom_parameters WHERE inspection_id = ? ORDER BY id').all(id).map((row) => ({ ...row })) as never[];
  const category_photos = database.prepare('SELECT * FROM category_photos WHERE inspection_id = ? ORDER BY id').all(id).map((row) => ({ ...row })) as never[];
  return { ...inspection, custom_parameters, category_photos };
}

export function listInspections(): Inspection[] { return getDatabase().prepare('SELECT * FROM inspections ORDER BY updated_at DESC').all().map((row) => ({ ...row })) as Inspection[]; }

export function updateInspection(id: number, input: Partial<InspectionInput>) {
  if (input.final_score != null && (Number(input.final_score) < 1 || Number(input.final_score) > 10)) throw new Error('Final score must be between 1 and 10');
  const entries = Object.entries(input).filter(([key]) => columns.includes(key as (typeof columns)[number]));
  if (!entries.length) return;
  const database = getDatabase();
  database.prepare(`UPDATE inspections SET ${entries.map(([key]) => `${key} = ?`).join(', ')}, updated_at = ? WHERE id = ?`).run(...entries.map(([, value]) => (value as DatabaseValue | undefined) ?? null), new Date().toISOString(), id);
}

export function deleteInspection(id: number) { getDatabase().prepare('DELETE FROM inspections WHERE id = ?').run(id); }

export function filterInspectionsByRating(ratings: Decision[]) {
  if (!ratings.length) return listInspections();
  return getDatabase().prepare(`SELECT * FROM inspections WHERE decision IN (${ratings.map(() => '?').join(',')}) ORDER BY updated_at DESC`).all(...ratings).map((row) => ({ ...row })) as Inspection[];
}