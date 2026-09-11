export const chassisTypes = ['Ducato', 'Sprinter', 'MAN/Crafter', 'Other'] as const;
export const lengthCategories = ['<6m', '6m-6.4m', '7m', '7.3m+'] as const;
export const payloadCapacities = [35, 42, 45, 50] as const;
export const drivetrainTypes = ['RWD', 'FWD', '4x4'] as const;
export const batteryTypes = ['LiFePO4', 'AGM'] as const;
export const freshWaterLiters = [100, 120, 150, 200] as const;
export const greyWaterLiters = [80, 100, 120, 150] as const;
export const heatingTypes = ['Truma Gas', 'Diesel Combi', 'Combi Diesel + Electric', 'Alde Gas', 'Alde Diesel'] as const;
export const fridgeTypes = ['Compressor 12V', 'Trivalent'] as const;
export const bathroomTypes = ['Vario', 'Separated'] as const;
export const toiletTypes = ['Cassette', 'Separation', 'Clesana'] as const;
export const bedLayouts = ['Transversal', 'Twin', 'Drop-down'] as const;
export const decisions = ['Rejected', 'Interesting', 'Top Candidate'] as const;

export type ChassisType = (typeof chassisTypes)[number];
export type LengthCategory = (typeof lengthCategories)[number];
export type Decision = (typeof decisions)[number];
export type Inspection = Record<string, unknown> & { id: number; make_model: string; asking_price: number; camper_photo_path?: string | null; decision?: Decision | null };
export type CustomParameter = { id: number; inspection_id: number; category: string; label: string; value: string };
export type CategoryPhoto = { id: number; inspection_id: number; category: string; file_path: string; created_at: string };
export type InspectionBundle = Inspection & { custom_parameters: CustomParameter[]; category_photos: CategoryPhoto[] };

export type InspectionInput = Partial<Omit<Inspection, 'id' | 'created_at' | 'updated_at'>> & {
  make_model: string;
  asking_price: number;
};

export const categoryKeys = ['drivetrain', 'structure', 'electrical', 'hydraulics', 'climate', 'kitchen', 'bathroom', 'garage'] as const;
export type CategoryKey = (typeof categoryKeys)[number];