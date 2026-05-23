import { Router } from 'express';
import treatmentController from '../controllers/treatmentController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import {
  treatmentSchema,
  updateTreatmentSchema,
  idParamSchema,
} from '../validators/schemas.js';

const router = Router();

router.get('/', authenticate, treatmentController.list);
router.get('/:id', authenticate, validate(idParamSchema), treatmentController.getById);

router.use(authenticate, requireRole('admin'));

router.post('/', validate(treatmentSchema), treatmentController.create);
router.put('/:id', validate(updateTreatmentSchema), treatmentController.update);
router.delete('/:id', validate(idParamSchema), treatmentController.remove);

export default router;
