import dentistModel from '../models/dentistModel.js';
import treatmentModel from '../models/treatmentModel.js';

const dentistController = {
  list(req, res) {
    const dentists = dentistModel.findAll().map((d) => ({
      ...d,
      treatments: dentistModel.getTreatments(d.id),
    }));
    res.json({ dentists });
  },

  getById(req, res) {
    const dentist = dentistModel.findById(req.params.id);
    if (!dentist) {
      return res.status(404).json({ error: 'Dentist not found' });
    }
    res.json({
      dentist: { ...dentist, treatments: dentistModel.getTreatments(dentist.id) },
    });
  },

  create(req, res) {
    const dentist = dentistModel.create(req.body);
    res.status(201).json({ dentist });
  },

  update(req, res) {
    const existing = dentistModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Dentist not found' });
    }
    const dentist = dentistModel.update(req.params.id, req.body);
    res.json({ dentist });
  },

  remove(req, res) {
    const existing = dentistModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Dentist not found' });
    }
    dentistModel.delete(req.params.id);
    res.json({ message: 'Dentist deleted' });
  },

  assignTreatment(req, res) {
    const dentist = dentistModel.findById(req.params.id);
    if (!dentist) {
      return res.status(404).json({ error: 'Dentist not found' });
    }

    const treatment = treatmentModel.findById(req.body.treatmentId);
    if (!treatment) {
      return res.status(404).json({ error: 'Treatment not found' });
    }

    dentistModel.assignTreatment(req.params.id, req.body.treatmentId);
    res.json({
      message: 'Treatment assigned',
      treatments: dentistModel.getTreatments(req.params.id),
    });
  },

  removeTreatment(req, res) {
    const { id, treatmentId } = req.params;
    dentistModel.removeTreatment(id, treatmentId);
    res.json({
      message: 'Treatment removed',
      treatments: dentistModel.getTreatments(id),
    });
  },
};

export default dentistController;
