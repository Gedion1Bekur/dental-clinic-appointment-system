import db from '../config/db.js';

const treatmentModel = {
  findAll() {
    return db.prepare('SELECT * FROM treatments ORDER BY id').all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM treatments WHERE id = ?').get(id);
  },

  create({ name, durationMinutes, price }) {
    const result = db
      .prepare('INSERT INTO treatments (name, duration_minutes, price) VALUES (?, ?, ?)')
      .run(name, durationMinutes, price);
    return this.findById(result.lastInsertRowid);
  },

  update(id, { name, durationMinutes, price }) {
    const fields = [];
    const values = [];
    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }
    if (durationMinutes !== undefined) {
      fields.push('duration_minutes = ?');
      values.push(durationMinutes);
    }
    if (price !== undefined) {
      fields.push('price = ?');
      values.push(price);
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    db.prepare(`UPDATE treatments SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  },

  delete(id) {
    return db.prepare('DELETE FROM treatments WHERE id = ?').run(id);
  },
};

export default treatmentModel;
