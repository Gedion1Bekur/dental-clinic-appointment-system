import bcrypt from 'bcrypt';
import db from './db.js';

const SCHEMA = `
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

CREATE INDEX IF NOT EXISTS idx_appointments_dentist ON appointments(dentist_id, datetime_start, datetime_end);
CREATE INDEX IF NOT EXISTS idx_appointments_room ON appointments(room_number, datetime_start, datetime_end);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
`;

function seedIfEmpty() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count > 0) return;

  const adminHash = bcrypt.hashSync('Admin123!', 10);
  const patientHash = bcrypt.hashSync('Patient123!', 10);

  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
  );

  insertUser.run('Admin User', 'admin@clinic.com', adminHash, 'admin');
  insertUser.run('John Patient', 'john@patient.com', patientHash, 'patient');
  insertUser.run('Jane Patient', 'jane@patient.com', patientHash, 'patient');

  const insertDentist = db.prepare(
    'INSERT INTO dentists (name, specialization) VALUES (?, ?)'
  );
  insertDentist.run('Dr. Sarah Chen', 'General Dentistry');
  insertDentist.run('Dr. Michael Ross', 'Orthodontics');
  insertDentist.run('Dr. Emily Park', 'Endodontics');

  const insertTreatment = db.prepare(
    'INSERT INTO treatments (name, duration_minutes, price) VALUES (?, ?, ?)'
  );
  insertTreatment.run('Dental Cleaning', 45, 120);
  insertTreatment.run('Cavity Filling', 60, 200);
  insertTreatment.run('Root Canal', 90, 800);
  insertTreatment.run('Teeth Whitening', 60, 350);
  insertTreatment.run('Orthodontic Consultation', 30, 150);

  const insertDT = db.prepare(
    'INSERT INTO dentist_treatments (dentist_id, treatment_id) VALUES (?, ?)'
  );
  // Dr. Sarah - general
  [1, 2, 4].forEach((t) => insertDT.run(1, t));
  // Dr. Michael - ortho
  [4, 5].forEach((t) => insertDT.run(2, t));
  // Dr. Emily - endo
  [2, 3].forEach((t) => insertDT.run(3, t));

  console.log('Database seeded with initial data.');
}

export function initializeDatabase() {
  db.exec(SCHEMA);
  seedIfEmpty();
  console.log('Database initialized.');
}
