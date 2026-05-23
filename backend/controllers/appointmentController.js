import appointmentModel from '../models/appointmentModel.js';
import schedulerService from '../services/schedulerService.js';

const appointmentController = {
  create(req, res, next) {
    try {
      const patientId =
        req.user.role === 'admin' && req.body.patientId
          ? req.body.patientId
          : req.user.id;

      const appointment = schedulerService.bookAppointment({
        patientId,
        dentistId: req.body.dentistId,
        treatmentId: req.body.treatmentId,
        datetimeStart: req.body.datetimeStart,
      });

      res.status(201).json({ appointment });
    } catch (err) {
      next(err);
    }
  },

  list(req, res) {
    const filters = { ...req.query };

    if (req.user.role === 'patient') {
      filters.patientId = req.user.id;
    }

    const appointments = appointmentModel.findAll(filters);
    res.json({ appointments });
  },

  getById(req, res) {
    const appointment = appointmentModel.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (req.user.role === 'patient' && appointment.patient_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ appointment });
  },

  update(req, res, next) {
    try {
      const { id } = req.params;
      const existing = appointmentModel.findById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      if (req.user.role === 'patient' && existing.patient_id !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      if (req.body.status && req.user.role === 'patient' && req.body.status !== 'cancelled') {
        return res.status(403).json({ error: 'Patients can only cancel appointments' });
      }

      if (req.body.status === 'cancelled' && !req.body.dentistId && !req.body.datetimeStart) {
        const appointment = appointmentModel.update(id, { status: 'cancelled' });
        return res.json({ appointment });
      }

      if (req.body.dentistId || req.body.treatmentId || req.body.datetimeStart) {
        const appointment = schedulerService.rescheduleAppointment({
          appointmentId: Number(id),
          dentistId: req.body.dentistId,
          treatmentId: req.body.treatmentId,
          datetimeStart: req.body.datetimeStart,
        });

        if (req.body.status) {
          appointmentModel.update(id, { status: req.body.status });
        }

        return res.json({ appointment: appointmentModel.findById(id) });
      }

      const appointment = appointmentModel.update(id, { status: req.body.status });
      res.json({ appointment });
    } catch (err) {
      next(err);
    }
  },

  remove(req, res) {
    const { id } = req.params;
    const existing = appointmentModel.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (req.user.role === 'patient' && existing.patient_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    appointmentModel.delete(id);
    res.json({ message: 'Appointment deleted' });
  },
};

export default appointmentController;
