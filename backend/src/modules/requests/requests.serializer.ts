import { Approver, PurchaseRequest } from "../../database/models.js";
import { env } from "../../config/env.js";

export const serializeRequest = (request: PurchaseRequest & { approvers?: Approver[] }) => {
  return {
    id: request.id,
    titulo: request.title,
    descripcion: request.description,
    monto: Number(request.amount),
    solicitante: request.requesterName,
    estado: request.status,
    evidenciaUrl: request.evidencePath ? `${env.API_BASE_URL}/api/solicitudes/${request.id}/evidencia.pdf` : null,
    completedAt: request.completedAt,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    aprobadores: request.approvers?.map((approver) => ({
      id: approver.id,
      nombre: approver.name,
      email: approver.email,
      estado: approver.status,
      signedAt: approver.signedAt,
      rejectedAt: approver.rejectedAt,
      enlaceAprobacion: `${env.FRONTEND_URL}/aprobacion/${approver.token}`
    })) ?? []
  };
};
