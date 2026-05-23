import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(100),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z
    .object({
      name: z.string().min(2).max(100).optional(),
      email: z.string().email().optional(),
      role: z.enum(['admin', 'patient']).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field required',
    }),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const createAppointmentSchema = z.object({
  body: z.object({
    dentistId: z.number().int().positive(),
    treatmentId: z.number().int().positive(),
    datetimeStart: z.string().min(1),
    patientId: z.number().int().positive().optional(),
  }),
});

export const updateAppointmentSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z
    .object({
      dentistId: z.number().int().positive().optional(),
      treatmentId: z.number().int().positive().optional(),
      datetimeStart: z.string().optional(),
      status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field required',
    }),
});

export const appointmentQuerySchema = z.object({
  query: z.object({
    dentistId: z.coerce.number().int().positive().optional(),
    status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  }),
});

export const dentistSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    specialization: z.string().min(2).max(100),
  }),
});

export const updateDentistSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z
    .object({
      name: z.string().min(2).max(100).optional(),
      specialization: z.string().min(2).max(100).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field required',
    }),
});

export const treatmentSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    durationMinutes: z.number().int().positive(),
    price: z.number().positive(),
  }),
});

export const updateTreatmentSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z
    .object({
      name: z.string().min(2).max(100).optional(),
      durationMinutes: z.number().int().positive().optional(),
      price: z.number().positive().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field required',
    }),
});

export const assignTreatmentSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    treatmentId: z.number().int().positive(),
  }),
});

export const profileUpdateSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(100).optional(),
      email: z.string().email().optional(),
      password: z.string().min(8).max(100).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field required',
    }),
});
