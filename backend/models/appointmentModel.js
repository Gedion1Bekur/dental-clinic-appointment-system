import db from '../config/db.js';

const appointmentSelect = `
  SELECT a.*,
    u.name AS patient_name,
    u.email AS patient_email,
    d.name AS dentist_name,
    t.name AS treatment_name,
    t.duration_minutes,
    t.price
  FROM appointments a
  JOIN users u ON u.id = a.patient_id
  JOIN dentists d ON d.id = a.dentist_id
  JOIN treatments t ON t.id = a.treatment_id
`;

const appointmentModel = {
  findById(id) {
    return db.prepare(`${appointmentSelect} WHERE a.id = ?`).get(id);
  },

  findAll(filters = {}) {
    let sql = `${appointmentSelect} WHERE 1=1`;
    const params = [];

    if (filters.patientId) {
      sql += ' AND a.patient_id = ?';
      params.push(filters.patientId);
    }
    if (filters.dentistId) {
      sql += ' AND a.dentist_id = ?';
      params.push(filters.dentistId);
    }
    if (filters.status) {
      sql += ' AND a.status = ?';
      params.push(filters.status);
    }
    if (filters.dateFrom) {
      sql += ' AND a.datetime_start >= ?';
      params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
      sql += ' AND a.datetime_start <= ?';
      params.push(filters.dateTo);
    }

    sql += ' ORDER BY a.datetime_start ASC';
    return db.prepare(sql).all(...params);
  },

  create({ patientId, dentistId, treatmentId, roomNumber, datetimeStart, datetimeEnd, status }) {
    const result = db
      .prepare(
        `INSERT INTO appointments
         (patient_id, dentist_id, treatment_id, room_number, datetime_start, datetime_end, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        patientId,
        dentistId,
        treatmentId,
        roomNumber,
        datetimeStart,
        datetimeEnd,
        status || 'scheduled'
      );
    return this.findById(result.lastInsertRowid);
  },

  update(id, fields) {
    const allowed = ['dentist_id', 'treatment_id', 'room_number', 'datetime_start', 'datetime_end', 'status'];
    const updates = [];
    const values = [];

    const mapping = {
      dentistId: 'dentist_id',
      treatmentId: 'treatment_id',
      roomNumber: 'room_number',
      datetimeStart: 'datetime_start',
      datetimeEnd: 'datetime_end',
      status: 'status',
    };

    for (const [key, col] of Object.entries(mapping)) {
      if (fields[key] !== undefined) {
        updates.push(`${col} = ?`);
        values.push(fields[key]);
      }
    }

    if (updates.length === 0) return this.findById(id);
    values.push(id);
    db.prepare(`UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  },

  delete(id) {
    return db.prepare('DELETE FROM appointments WHERE id = ?').run(id);
  },

  findOverlappingForDentist(dentistId, start, end, excludeId = null) {
    let sql = `
      SELECT * FROM appointments
      WHERE dentist_id = ?
        AND status != 'cancelled'
        AND datetime_start < ?
        AND datetime_end > ?
    `;
    const params = [dentistId, end, start];
    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }
    return db.prepare(sql).all(...params);
  },

  findOverlappingForRoom(roomNumber, start, end, excludeId = null) {
    let sql = `
      SELECT * FROM appointments
      WHERE room_number = ?
        AND status != 'cancelled'
        AND datetime_start < ?
        AND datetime_end > ?
    `;
    const params = [roomNumber, end, start];
    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }
    return db.prepare(sql).all(...params);
  },
};

export default appointmentModel;
