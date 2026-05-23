import db from '../config/db.js';

const dentistModel = {
  findAll() {
    return db.prepare('SELECT * FROM dentists ORDER BY id').all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM dentists WHERE id = ?').get(id);
  },

  create({ name, specialization }) {
    const result = db
      .prepare('INSERT INTO dentists (name, specialization) VALUES (?, ?)')
      .run(name, specialization);
    return this.findById(result.lastInsertRowid);
  },

  update(id, { name, specialization }) {
    const fields = [];
    const values = [];
    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }
    if (specialization !== undefined) {
      fields.push('specialization = ?');
      values.push(specialization);
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    db.prepare(`UPDATE dentists SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  },

  delete(id) {
    return db.prepare('DELETE FROM dentists WHERE id = ?').run(id);
  },

  getTreatments(dentistId) {
    return db
      .prepare(
        `SELECT t.* FROM treatments t
         INNER JOIN dentist_treatments dt ON dt.treatment_id = t.id
         WHERE dt.dentist_id = ?`
      )
      .all(dentistId);
  },

  assignTreatment(dentistId, treatmentId) {
    return db
      .prepare('INSERT OR IGNORE INTO dentist_treatments (dentist_id, treatment_id) VALUES (?, ?)')
      .run(dentistId, treatmentId);
  },

  removeTreatment(dentistId, treatmentId) {
    return db
      .prepare('DELETE FROM dentist_treatments WHERE dentist_id = ? AND treatment_id = ?')
      .run(dentistId, treatmentId);
  },

  canPerformTreatment(dentistId, treatmentId) {
    const row = db
      .prepare(
        'SELECT 1 FROM dentist_treatments WHERE dentist_id = ? AND treatment_id = ?'
      )
      .get(dentistId, treatmentId);
    return !!row;
  },
};

export default dentistModel;
