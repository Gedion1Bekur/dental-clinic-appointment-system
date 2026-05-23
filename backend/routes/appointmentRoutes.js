import { Router } from 'express';
import appointmentController from '../controllers/appointmentController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  appointmentQuerySchema,
  idParamSchema,
} from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createAppointmentSchema), appointmentController.create);
router.get('/', validate(appointmentQuerySchema), appointmentController.list);
router.get('/:id', validate(idParamSchema), appointmentController.getById);
router.put('/:id', validate(updateAppointmentSchema), appointmentController.update);
router.delete('/:id', validate(idParamSchema), appointmentController.remove);

export default router;
