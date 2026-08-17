import { screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ApprovalPage } from "../src/pages/ApprovalPage";
import { RequestCreatePage } from "../src/pages/RequestCreatePage";
import { RequestDetailPage } from "../src/pages/RequestDetailPage";
import { RequestsListPage } from "../src/pages/RequestsListPage";
import { renderWithQueryClient } from "./testUtils";

vi.mock("../src/features/approval/ApprovalPanel", () => ({
  ApprovalPanel: () => <div>Panel de aprobación</div>
}));

vi.mock("../src/features/requests/RequestForm", () => ({
  RequestForm: () => <div>Formulario de solicitud</div>
}));

vi.mock("../src/features/requests/RequestsList", () => ({
  RequestsList: () => <div>Lista de solicitudes</div>
}));

vi.mock("../src/api/requestsApi", () => ({
  requestsApi: {
    detail: async () => ({
      id: "request-id",
      titulo: "Compra de licencias",
      descripcion: "Licencias anuales para operaciones",
      monto: 900000,
      solicitante: "Laura Gomez",
      estado: "COMPLETED",
      evidenciaUrl: "http://localhost:4000/api/solicitudes/request-id/evidencia.pdf",
      completedAt: "2026-08-16T10:00:00.000Z",
      createdAt: "2026-08-16T09:00:00.000Z",
      updatedAt: "2026-08-16T10:00:00.000Z",
      aprobadores: [
        {
          id: "approver-1",
          nombre: "Carlos Ruiz",
          email: "carlos@example.com",
          estado: "SIGNED",
          signedAt: "2026-08-16T09:20:00.000Z",
          rejectedAt: null,
          enlaceAprobacion: "http://localhost:5173/aprobacion/token-1"
        }
      ]
    })
  }
}));

describe("pages", () => {
  it("renders requests list page", () => {
    renderWithQueryClient(
      <MemoryRouter>
        <RequestsListPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Panel de solicitudes")).toBeInTheDocument();
    expect(screen.getByText("Lista de solicitudes")).toBeInTheDocument();
  });

  it("renders request create page", () => {
    renderWithQueryClient(
      <MemoryRouter>
        <RequestCreatePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Nueva solicitud")).toBeInTheDocument();
    expect(screen.getByText("Formulario de solicitud")).toBeInTheDocument();
  });

  it("renders approval page", () => {
    renderWithQueryClient(
      <MemoryRouter>
        <ApprovalPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Panel de aprobación")).toBeInTheDocument();
  });

  it("renders request detail page", async () => {
    renderWithQueryClient(
      <MemoryRouter initialEntries={["/solicitudes/request-id"]}>
        <Routes>
          <Route path="/solicitudes/:id" element={<RequestDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Compra de licencias")).toBeInTheDocument();
    expect(screen.getByText("Estado de aprobadores")).toBeInTheDocument();
  });
});
