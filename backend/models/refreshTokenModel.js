import db from '../config/db.js';

const refreshTokenModel = {
  create({ userId, token, expiryDate }) {
    const result = db
      .prepare('INSERT INTO refresh_tokens (user_id, token, expiry_date) VALUES (?, ?, ?)')
      .run(userId, token, expiryDate);
    return { id: result.lastInsertRowid, userId, token, expiryDate };
  },

  findByToken(token) {
    return db.prepare('SELECT * FROM refresh_tokens WHERE token = ?').get(token);
  },

  deleteByToken(token) {
    return db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(token);
  },

  deleteByUserId(userId) {
    return db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(userId);
  },

  deleteExpired() {
    return db
      .prepare("DELETE FROM refresh_tokens WHERE expiry_date < datetime('now')")
      .run();
  },
};

export default refreshTokenModel;
