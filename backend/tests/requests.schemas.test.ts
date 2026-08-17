import { describe, expect, it } from "vitest";
import { createRequestSchema } from "../src/modules/requests/requests.schemas.js";

describe("createRequestSchema", () => {
  it("accepts a valid request with exactly three approvers", () => {
    const result = createRequestSchema.safeParse({
      titulo: "Compra de licencias",
      descripcion: "Licencias anuales para el equipo financiero",
      monto: 1200000,
      solicitante: "Laura Gomez",
      aprobadores: [
        { nombre: "Carlos Ruiz", email: "carlos@example.com" },
        { nombre: "Maria Perez", email: "maria@example.com" },
        { nombre: "Ana Torres", email: "ana@example.com" }
      ]
    });

    expect(result.success).toBe(true);
  });

  it("rejects requests without three approvers", () => {
    const result = createRequestSchema.safeParse({
      titulo: "Compra de licencias",
      descripcion: "Licencias anuales para el equipo financiero",
      monto: 1200000,
      solicitante: "Laura Gomez",
      aprobadores: [
        { nombre: "Carlos Ruiz", email: "carlos@example.com" }
      ]
    });

    expect(result.success).toBe(false);
  });
});
