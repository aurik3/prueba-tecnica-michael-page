export type RequestStatus = "PENDING" | "REJECTED" | "COMPLETED";
export type ApproverStatus = "PENDING" | "SIGNED" | "REJECTED";

export type Approver = {
  id: string;
  nombre: string;
  email: string;
  estado: ApproverStatus;
  signedAt: string | null;
  rejectedAt: string | null;
  enlaceAprobacion: string;
};

export type PurchaseRequest = {
  id: string;
  titulo: string;
  descripcion: string;
  monto: number;
  solicitante: string;
  estado: RequestStatus;
  evidenciaUrl: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  aprobadores: Approver[];
};

export type ApprovalDetail = {
  id: string;
  token: string;
  nombre: string;
  email: string;
  estado: ApproverStatus;
  signedAt: string | null;
  rejectedAt: string | null;
  otpValidatedUntil: string | null;
  solicitud: {
    id: string;
    titulo: string;
    descripcion: string;
    monto: number;
    solicitante: string;
    estado: RequestStatus;
    createdAt: string;
  } | null;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};
