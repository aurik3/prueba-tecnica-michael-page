import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { requestsApi } from "../src/api/requestsApi";
import { RequestForm } from "../src/features/requests/RequestForm";
import { renderWithQueryClient } from "./testUtils";

vi.mock("../src/api/requestsApi", () => ({
  requestsApi: {
    list: vi.fn(),
    create: vi.fn(),
    detail: vi.fn()
  }
}));

describe("RequestForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requestsApi.create).mockResolvedValue({
      id: "request-id",
      titulo: "Compra de equipos",
      descripcion: "Compra de equipos para tecnologia",
      monto: 2000000,
      solicitante: "Laura Gomez",
      estado: "PENDING",
      evidenciaUrl: null,
      completedAt: null,
      createdAt: "2026-08-16T09:00:00.000Z",
      updatedAt: "2026-08-16T09:00:00.000Z",
      aprobadores: []
    });
  });

  it("submits a valid request", async () => {
    const user = userEvent.setup();

    renderWithQueryClient(<RequestForm />);

    await user.type(screen.getByLabelText("Solicitante"), "Laura Gomez");
    await user.clear(screen.getByLabelText("Monto"));
    await user.type(screen.getByLabelText("Monto"), "2000000");
    await user.type(screen.getByLabelText("Título"), "Compra de equipos");
    await user.type(screen.getByLabelText("Descripción"), "Compra de equipos para tecnologia");

    const nameInputs = screen.getAllByLabelText("Nombre");
    const emailInputs = screen.getAllByLabelText("Correo");

    await user.type(nameInputs[0], "Carlos Ruiz");
    await user.type(emailInputs[0], "carlos@example.com");
    await user.type(nameInputs[1], "Maria Perez");
    await user.type(emailInputs[1], "maria@example.com");
    await user.type(nameInputs[2], "Ana Torres");
    await user.type(emailInputs[2], "ana@example.com");
    await user.click(screen.getByRole("button", { name: /crear/i }));

    await waitFor(() => expect(vi.mocked(requestsApi.create).mock.calls[0][0]).toEqual(expect.objectContaining({
      titulo: "Compra de equipos",
      solicitante: "Laura Gomez"
    })));
  });
});
