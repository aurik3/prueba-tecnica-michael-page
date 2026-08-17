import { z } from "zod";

export const createRequestSchema = z.object({
  titulo: z.string().trim().min(3).max(160),
  descripcion: z.string().trim().min(10),
  monto: z.coerce.number().positive(),
  solicitante: z.string().trim().min(3).max(120),
  aprobadores: z.array(
    z.object({
      nombre: z.string().trim().min(3).max(120),
      email: z.string().trim().email().max(180)
    })
  ).length(3)
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
