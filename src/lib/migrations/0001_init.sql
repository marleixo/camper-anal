CREATE TABLE IF NOT EXISTS inspections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  make_model TEXT NOT NULL,
  asking_price REAL NOT NULL,
  trade_in_offer REAL,
  chassis_type TEXT NOT NULL,
  length_category TEXT NOT NULL,
  payload_capacity_kg INTEGER NOT NULL,
  drivetrain_type TEXT, is_automatic INTEGER, has_all_terrain_tires INTEGER, has_cab_blackout INTEGER, notes_drivetrain TEXT,
  has_double_floor INTEGER, has_flush_windows INTEGER, has_maxxfan INTEGER, has_air_conditioned INTEGER, notes_structure TEXT,
  battery_type TEXT, battery_ah INTEGER, dcdc_charger_amps INTEGER, solar_watts INTEGER, has_mppt INTEGER, inverter_watts INTEGER, has_inverter_bypass INTEGER, notes_electrical TEXT,
  fresh_water_liters INTEGER, grey_water_liters INTEGER, is_grey_tank_insulated INTEGER, has_shurflo_pump INTEGER, has_water_filter INTEGER, notes_hydraulics TEXT,
  heating_type TEXT, has_12v_ac INTEGER, has_duocontrol INTEGER, has_gpl_tank INTEGER, notes_climate TEXT,
  fridge_type TEXT, fridge_liters INTEGER, has_double_hinge_door INTEGER, has_induction_cooktop INTEGER, notes_kitchen TEXT,
  bathroom_type TEXT, toilet_type TEXT, has_sog INTEGER, bed_layout TEXT, has_froli INTEGER, notes_bathroom TEXT,
  garage_fits_motorcycle INTEGER, has_garage_rails INTEGER, has_outdoor_shower INTEGER, has_awning_led INTEGER, notes_garage TEXT,
  pros_summary TEXT, cons_summary TEXT, decision TEXT, final_score INTEGER CHECK (final_score IS NULL OR final_score BETWEEN 1 AND 10),
  camper_photo_path TEXT, price_board_photo_path TEXT
);
CREATE TABLE IF NOT EXISTS custom_parameters (id INTEGER PRIMARY KEY AUTOINCREMENT, inspection_id INTEGER NOT NULL REFERENCES inspections(id) ON DELETE CASCADE, category TEXT NOT NULL, label TEXT NOT NULL, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS category_photos (id INTEGER PRIMARY KEY AUTOINCREMENT, inspection_id INTEGER NOT NULL REFERENCES inspections(id) ON DELETE CASCADE, category TEXT NOT NULL, file_path TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS custom_parameters_inspection_idx ON custom_parameters(inspection_id);
CREATE INDEX IF NOT EXISTS category_photos_inspection_idx ON category_photos(inspection_id);