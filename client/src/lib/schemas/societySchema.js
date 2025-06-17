import { z } from "zod";

export const societySchema = z.object({
  name: z.string().min(2),
  registrationNumber: z.string().min(3),
  address: z.object({
    street: z.string().min(3),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().length(6)
  }),
  maintenancePolicy: z.object({
    frequency: z.enum(["monthly", "quarterly"]),
    amountPerFlat: z.coerce.number().min(100)
  })
});
