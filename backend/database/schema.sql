-- Dental Clinic SQLite Schema
-- Applied automatically by config/initDb.js on server startup

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'patient')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS dentists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS treatments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS dentist_treatments (
  dentist_id INTEGER NOT NULL,
  treatment_id INTEGER NOT NULL,
  PRIMARY KEY (dentist_id, treatment_id),
  FOREIGN KEY (dentist_id) REFERENCES dentists(id) ON DELETE CASCADE,
  FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  dentist_id INTEGER NOT NULL,
  treatment_id INTEGER NOT NULL,
  room_number INTEGER NOT NULL CHECK(room_number BETWEEN 1 AND 3),
  datetime_start TEXT NOT NULL,
  datetime_end TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'completed', 'cancelled')),
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (dentist_id) REFERENCES dentists(id),
  FOREIGN KEY (treatment_id) REFERENCES treatments(id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expiry_date TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
