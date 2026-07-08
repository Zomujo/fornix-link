import { requiredStringSchema } from '@/schemas/zod.schemas';
import { z } from 'zod';

const bookingFormBaseSchema = z.object({
  date: requiredStringSchema(),
  reason: requiredStringSchema(),
  appointmentType: requiredStringSchema(),
  additionalInfo: requiredStringSchema(false),
  isFollowUp: z.boolean(),
});

export const hospitalBookingSchema = bookingFormBaseSchema;

export const bookingSchema = bookingFormBaseSchema.extend({
  time: requiredStringSchema(),
  slotId: requiredStringSchema(),
});
