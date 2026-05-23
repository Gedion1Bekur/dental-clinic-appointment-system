import treatmentModel from '../models/treatmentModel.js';

const treatmentController = {
  list(req, res) {
    const treatments = treatmentModel.findAll();
    res.json({ treatments });
  },

  getById(req, res) {
    const treatment = treatmentModel.findById(req.params.id);
    if (!treatment) {
      return res.status(404).json({ error: 'Treatment not found' });
    }
    res.json({ treatment });
  },

  create(req, res) {
    const treatment = treatmentModel.create({
      name: req.body.name,
      durationMinutes: req.body.durationMinutes,
      price: req.body.price,
    });
    res.status(201).json({ treatment });
  },

  update(req, res) {
    const existing = treatmentModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Treatment not found' });
    }
    const treatment = treatmentModel.update(req.params.id, {
      name: req.body.name,
      durationMinutes: req.body.durationMinutes,
      price: req.body.price,
    });
    res.json({ treatment });
  },

  remove(req, res) {
    const existing = treatmentModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Treatment not found' });
    }
    treatmentModel.delete(req.params.id);
    res.json({ message: 'Treatment deleted' });
  },
};

export default treatmentController;
