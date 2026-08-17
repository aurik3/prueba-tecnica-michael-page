import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { requestsApi } from "../src/api/requestsApi";
import { RequestsList } from "../src/features/requests/RequestsList";
import { renderWithQueryClient } from "./testUtils";

vi.mock("../src/api/requestsApi", () => ({
  requestsApi: {
    list: vi.fn(),
    create: vi.fn(),
    detail: vi.fn()
  }
}));

const request = {
  id: "request-id",
  titulo: "Compra de licencias",
  descripcion: "Licencias anuales para operaciones",
  monto: 900000,
  solicitante: "Laura Gomez",
  estado: "COMPLETED" as const,
  evidenciaUrl: "http://localhost:4000/api/solicitudes/request-id/evidencia.pdf",
  completedAt: "2026-08-16T10:00:00.000Z",
  createdAt: "2026-08-16T09:00:00.000Z",
  updatedAt: "2026-08-16T10:00:00.000Z",
  aprobadores: [
    {
      id: "approver-1",
      nombre: "Carlos Ruiz",
      email: "carlos@example.com",
      estado: "SIGNED" as const,
      signedAt: "2026-08-16T09:20:00.000Z",
      rejectedAt: null,
      enlaceAprobacion: "http://localhost:5173/aprobacion/token-1"
    },
    {
      id: "approver-2",
      nombre: "Maria Perez",
      email: "maria@example.com",
      estado: "SIGNED" as const,
      signedAt: "2026-08-16T09:30:00.000Z",
      rejectedAt: null,
      enlaceAprobacion: "http://localhost:5173/aprobacion/token-2"
    },
    {
      id: "approver-3",
      nombre: "Ana Torres",
      email: "ana@example.com",
      estado: "SIGNED" as const,
      signedAt: "2026-08-16T09:40:00.000Z",
      rejectedAt: null,
      enlaceAprobacion: "http://localhost:5173/aprobacion/token-3"
    }
  ]
};

describe("RequestsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requestsApi.list).mockResolvedValue([request]);
  });

  it("renders requests and evidence link", async () => {
    renderWithQueryClient(
      <MemoryRouter>
        <RequestsList />
      </MemoryRouter>
    );

    expect(await screen.findByText("Compra de licencias")).toBeInTheDocument();
    expect(screen.getByText("Completada")).toBeInTheDocument();
    expect(screen.getByText("Ver detalle")).toHaveAttribute("href", "/solicitudes/request-id");
  });

  it("refreshes the list", async () => {
    const user = userEvent.setup();

    renderWithQueryClient(
      <MemoryRouter>
        <RequestsList />
      </MemoryRouter>
    );

    await screen.findByText("Compra de licencias");
    const currentCalls = vi.mocked(requestsApi.list).mock.calls.length;
    await user.click(screen.getByRole("button", { name: /actualizar/i }));

    await waitFor(() => expect(requestsApi.list).toHaveBeenCalledTimes(currentCalls + 1));
  });
});
