import { randomUUID } from "node:crypto";
import { sequelize } from "../../database/sequelize.js";
import { Approver, PurchaseRequest } from "../../database/models.js";
import { AppError } from "../../shared/errors/AppError.js";
import { evidenceService } from "../evidence/evidence.service.js";
import { CreateRequestInput } from "./requests.schemas.js";

export class RequestsService {
  async create(input: CreateRequestInput) {
    const requestId = await sequelize.transaction(async (transaction) => {
      const request = await PurchaseRequest.create(
        {
          title: input.titulo,
          description: input.descripcion,
          amount: input.monto.toFixed(2),
          requesterName: input.solicitante
        },
        { transaction }
      );

      await Approver.bulkCreate(
        input.aprobadores.map((approver) => ({
          requestId: request.id,
          name: approver.nombre,
          email: approver.email,
          token: randomUUID()
        })),
        { transaction }
      );

      return request.id;
    });

    return this.findById(requestId);
  }

  async list() {
    return PurchaseRequest.findAll({
      include: [{ model: Approver, as: "approvers" }],
      order: [["createdAt", "DESC"], [{ model: Approver, as: "approvers" }, "createdAt", "ASC"]]
    });
  }

  async findById(id: string) {
    const request = await PurchaseRequest.findByPk(id, {
      include: [{ model: Approver, as: "approvers" }],
      order: [[{ model: Approver, as: "approvers" }, "createdAt", "ASC"]]
    });

    if (!request) {
      throw new AppError("Solicitud no encontrada", 404, "RESOURCE_NOT_FOUND");
    }

    return request;
  }

  async findEvidenceRequest(id: string) {
    const request = await PurchaseRequest.findByPk(id);

    if (!request) {
      throw new AppError("Solicitud no encontrada", 404, "RESOURCE_NOT_FOUND");
    }

    return request;
  }

  async completeIfReady(requestId: string) {
    const request = await this.findById(requestId);
    const approvers = ((request as PurchaseRequest & { approvers?: Approver[] }).approvers ?? []);

    if (request.status !== "PENDING") {
      return request;
    }

    if (approvers.length === 3 && approvers.every((approver: Approver) => approver.status === "SIGNED")) {
      const evidence = await evidenceService.generate(request, approvers);
      await request.update({
        status: "COMPLETED",
        completedAt: new Date(),
        evidencePath: evidence.path,
        evidenceKey: evidence.key
      });
      return this.findById(requestId);
    }

    return request;
  }
}

export const requestsService = new RequestsService();
