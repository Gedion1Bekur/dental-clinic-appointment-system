import { Router } from 'express';
import dentistController from '../controllers/dentistController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import {
  dentistSchema,
  updateDentistSchema,
  idParamSchema,
  assignTreatmentSchema,
} from '../validators/schemas.js';

const router = Router();

router.get('/', authenticate, dentistController.list);
router.get('/:id', authenticate, validate(idParamSchema), dentistController.getById);

router.use(authenticate, requireRole('admin'));

router.post('/', validate(dentistSchema), dentistController.create);
router.put('/:id', validate(updateDentistSchema), dentistController.update);
router.delete('/:id', validate(idParamSchema), dentistController.remove);
router.post('/:id/treatments', validate(assignTreatmentSchema), dentistController.assignTreatment);
router.delete(
  '/:id/treatments/:treatmentId',
  validate(idParamSchema),
  dentistController.removeTreatment
);

export default router;
