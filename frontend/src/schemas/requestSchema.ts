import { z } from "zod";

export const createRequestSchema = z.object({
  titulo: z.string().trim().min(3, "El título debe tener mínimo 3 caracteres"),
  descripcion: z.string().trim().min(10, "La descripción debe tener mínimo 10 caracteres"),
  monto: z.coerce.number().positive("El monto debe ser mayor a cero"),
  solicitante: z.string().trim().min(3, "El solicitante debe tener mínimo 3 caracteres"),
  aprobadores: z.array(
    z.object({
      nombre: z.string().trim().min(3, "El nombre debe tener mínimo 3 caracteres"),
      email: z.string().trim().email("Ingresa un correo válido")
    })
  ).length(3)
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
