import { describe, expect, it } from "vitest";
import { createRequestSchema } from "../src/schemas/requestSchema";

describe("createRequestSchema", () => {
  it("validates the purchase request form", () => {
    const result = createRequestSchema.safeParse({
      titulo: "Compra de licencias",
      descripcion: "Licencias anuales para operaciones",
      monto: 850000,
      solicitante: "Laura Gomez",
      aprobadores: [
        { nombre: "Carlos Ruiz", email: "carlos@example.com" },
        { nombre: "Maria Perez", email: "maria@example.com" },
        { nombre: "Ana Torres", email: "ana@example.com" }
      ]
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid emails", () => {
    const result = createRequestSchema.safeParse({
      titulo: "Compra de licencias",
      descripcion: "Licencias anuales para operaciones",
      monto: 850000,
      solicitante: "Laura Gomez",
      aprobadores: [
        { nombre: "Carlos Ruiz", email: "correo-invalido" },
        { nombre: "Maria Perez", email: "maria@example.com" },
        { nombre: "Ana Torres", email: "ana@example.com" }
      ]
    });

    expect(result.success).toBe(false);
  });
});
