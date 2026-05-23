import db from '../config/db.js';

const userModel = {
  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  findById(id) {
    return db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(id);
  },

  findAll() {
    return db
      .prepare('SELECT id, name, email, role, created_at FROM users ORDER BY id')
      .all();
  },

  create({ name, email, passwordHash, role }) {
    const result = db
      .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .run(name, email, passwordHash, role);
    return this.findById(result.lastInsertRowid);
  },

  update(id, { name, email, role }) {
    const fields = [];
    const values = [];
    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      fields.push('email = ?');
      values.push(email);
    }
    if (role !== undefined) {
      fields.push('role = ?');
      values.push(role);
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  },

  updatePassword(id, passwordHash) {
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, id);
  },

  delete(id) {
    return db.prepare('DELETE FROM users WHERE id = ?').run(id);
  },

  getPasswordHash(id) {
    const row = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(id);
    return row?.password_hash;
  },
};

export default userModel;
