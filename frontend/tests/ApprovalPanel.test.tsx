import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { approvalsApi } from "../src/api/approvalsApi";
import { ApprovalPanel } from "../src/features/approval/ApprovalPanel";
import { renderWithQueryClient } from "./testUtils";

vi.mock("../src/api/approvalsApi", () => ({
  approvalsApi: {
    detail: vi.fn(),
    requestOtp: vi.fn(),
    verifyOtp: vi.fn(),
    approve: vi.fn(),
    reject: vi.fn()
  }
}));

const approvalBase = {
  id: "approver-id",
  token: "token-id",
  nombre: "Carlos Ruiz",
  email: "carlos@example.com",
  estado: "PENDING" as const,
  signedAt: null,
  rejectedAt: null,
  otpValidatedUntil: null,
  solicitud: {
    id: "request-id",
    titulo: "Compra de licencias",
    descripcion: "Licencias anuales para operaciones",
    monto: 900000,
    solicitante: "Laura Gomez",
    estado: "PENDING" as const,
    createdAt: "2026-08-16T09:00:00.000Z"
  }
};

function renderPanel() {
  return renderWithQueryClient(
    <MemoryRouter initialEntries={["/approval/token-id"]}>
      <Routes>
        <Route path="/approval/:token" element={<ApprovalPanel />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ApprovalPanel", () => {
  beforeEach(() => {
    let verified = false;

    vi.mocked(approvalsApi.detail).mockImplementation(async () => ({
      ...approvalBase,
      otpValidatedUntil: verified ? "2099-01-01T00:00:00.000Z" : null
    }));
    vi.mocked(approvalsApi.requestOtp).mockResolvedValue({
      code: "123456",
      delivery: "simulated",
      expiresAt: "2026-08-16T09:03:00.000Z"
    });
    vi.mocked(approvalsApi.verifyOtp).mockImplementation(async () => {
      verified = true;
      return {
        validatedUntil: "2099-01-01T00:00:00.000Z"
      };
    });
    vi.mocked(approvalsApi.approve).mockResolvedValue({
      id: "request-id",
      titulo: "Compra de licencias",
      descripcion: "Licencias anuales para operaciones",
      monto: 900000,
      solicitante: "Laura Gomez",
      estado: "PENDING",
      evidenciaUrl: null,
      completedAt: null,
      createdAt: "2026-08-16T09:00:00.000Z",
      updatedAt: "2026-08-16T09:00:00.000Z",
      aprobadores: []
    });
    vi.mocked(approvalsApi.reject).mockResolvedValue({
      id: "request-id",
      titulo: "Compra de licencias",
      descripcion: "Licencias anuales para operaciones",
      monto: 900000,
      solicitante: "Laura Gomez",
      estado: "REJECTED",
      evidenciaUrl: null,
      completedAt: null,
      createdAt: "2026-08-16T09:00:00.000Z",
      updatedAt: "2026-08-16T09:00:00.000Z",
      aprobadores: []
    });
  });

  it("requests otp, verifies it and approves", async () => {
    const user = userEvent.setup();

    renderPanel();

    expect(await screen.findByText("Compra de licencias")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /solicitar otp/i }));

    expect(await screen.findByText("123456")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Código OTP"), "123456");
    await user.click(screen.getByRole("button", { name: /validar/i }));

    expect(await screen.findByText("OTP validado. Puedes registrar tu decisión.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /aprobar/i }));

    await waitFor(() => expect(approvalsApi.approve).toHaveBeenCalledWith("token-id"));
  });
});
