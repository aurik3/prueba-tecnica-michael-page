import { Approver, PurchaseRequest } from "../../database/models.js";

export const serializeApproval = (approver: Approver & { request?: PurchaseRequest }) => {
  return {
    id: approver.id,
    token: approver.token,
    nombre: approver.name,
    email: approver.email,
    estado: approver.status,
    signedAt: approver.signedAt,
    rejectedAt: approver.rejectedAt,
    otpValidatedUntil: approver.otpValidatedUntil,
    solicitud: approver.request ? {
      id: approver.request.id,
      titulo: approver.request.title,
      descripcion: approver.request.description,
      monto: Number(approver.request.amount),
      solicitante: approver.request.requesterName,
      estado: approver.request.status,
      createdAt: approver.request.createdAt
    } : null
  };
};
