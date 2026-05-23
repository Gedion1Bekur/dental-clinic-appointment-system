import appointmentModel from '../models/appointmentModel.js';
import dentistModel from '../models/dentistModel.js';
import treatmentModel from '../models/treatmentModel.js';

const ROOM_COUNT = 3;

function parseDateTime(isoString) {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) {
    const err = new Error('Invalid datetime format');
    err.status = 400;
    throw err;
  }
  return d;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function toISOString(date) {
  return date.toISOString();
}

const schedulerService = {
  calculateEndTime(datetimeStart, durationMinutes) {
    const start = parseDateTime(datetimeStart);
    const end = addMinutes(start, durationMinutes);
    return { start, end: end, datetimeStart: toISOString(start), datetimeEnd: toISOString(end) };
  },

  hasDentistConflict(dentistId, start, end, excludeId = null) {
    const overlaps = appointmentModel.findOverlappingForDentist(
      dentistId,
      start,
      end,
      excludeId
    );
    return overlaps.length > 0;
  },

  hasRoomConflict(roomNumber, start, end, excludeId = null) {
    const overlaps = appointmentModel.findOverlappingForRoom(
      roomNumber,
      start,
      end,
      excludeId
    );
    return overlaps.length > 0;
  },

  findAvailableRoom(start, end, excludeId = null) {
    for (let room = 1; room <= ROOM_COUNT; room++) {
      if (!this.hasRoomConflict(room, start, end, excludeId)) {
        return room;
      }
    }
    return null;
  },

  validateBooking({ dentistId, treatmentId, datetimeStart, excludeId = null }) {
    const dentist = dentistModel.findById(dentistId);
    if (!dentist) {
      const err = new Error('Dentist not found');
      err.status = 404;
      throw err;
    }

    const treatment = treatmentModel.findById(treatmentId);
    if (!treatment) {
      const err = new Error('Treatment not found');
      err.status = 404;
      throw err;
    }

    if (!dentistModel.canPerformTreatment(dentistId, treatmentId)) {
      const err = new Error('This dentist does not perform the selected treatment');
      err.status = 400;
      throw err;
    }

    const { datetimeStart: startIso, datetimeEnd: endIso } = this.calculateEndTime(
      datetimeStart,
      treatment.duration_minutes
    );

    if (this.hasDentistConflict(dentistId, startIso, endIso, excludeId)) {
      const err = new Error('Dentist is not available at the selected time');
      err.status = 409;
      throw err;
    }

    const room = this.findAvailableRoom(startIso, endIso, excludeId);
    if (!room) {
      const err = new Error('No treatment room available at the selected time');
      err.status = 409;
      throw err;
    }

    return {
      datetimeStart: startIso,
      datetimeEnd: endIso,
      roomNumber: room,
      treatment,
    };
  },

  bookAppointment({ patientId, dentistId, treatmentId, datetimeStart }) {
    const slot = this.validateBooking({ dentistId, treatmentId, datetimeStart });

    return appointmentModel.create({
      patientId,
      dentistId,
      treatmentId,
      roomNumber: slot.roomNumber,
      datetimeStart: slot.datetimeStart,
      datetimeEnd: slot.datetimeEnd,
      status: 'scheduled',
    });
  },

  rescheduleAppointment({ appointmentId, dentistId, treatmentId, datetimeStart }) {
    const existing = appointmentModel.findById(appointmentId);
    if (!existing) {
      const err = new Error('Appointment not found');
      err.status = 404;
      throw err;
    }

    const dId = dentistId ?? existing.dentist_id;
    const tId = treatmentId ?? existing.treatment_id;
    const start = datetimeStart ?? existing.datetime_start;

    const slot = this.validateBooking({
      dentistId: dId,
      treatmentId: tId,
      datetimeStart: start,
      excludeId: appointmentId,
    });

    return appointmentModel.update(appointmentId, {
      dentistId: dId,
      treatmentId: tId,
      roomNumber: slot.roomNumber,
      datetimeStart: slot.datetimeStart,
      datetimeEnd: slot.datetimeEnd,
    });
  },
};

export default schedulerService;
