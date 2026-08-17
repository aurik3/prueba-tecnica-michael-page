import { Approver, PurchaseRequest } from "../../database/models.js";
import { AppError } from "../../shared/errors/AppError.js";
import { otpService } from "../otp/otp.service.js";
import { requestsService } from "../requests/requests.service.js";

export class ApprovalsService {
  async findByToken(token: string) {
    const approver = await Approver.findOne({
      where: { token },
      include: [{ model: PurchaseRequest, as: "request" }]
    });

    if (!approver) {
      throw new AppError("Link de aprobación inválido", 404, "APPROVAL_TOKEN_INVALID");
    }

    return approver;
  }

  async requestOtp(token: string) {
    const approver = await this.findByToken(token);
    this.ensureProcessCanContinue(approver);
    return otpService.createForApprover(approver);
  }

  async verifyOtp(token: string, code: string) {
    const approver = await this.findByToken(token);
    this.ensureProcessCanContinue(approver);
    const validatedUntil = await otpService.verify(approver, code);
    return {
      validatedUntil
    };
  }

  async approve(token: string) {
    const approver = await this.findByToken(token);
    this.ensureProcessCanContinue(approver);
    otpService.ensureVerified(approver);

    await approver.update({
      status: "SIGNED",
      signedAt: new Date()
    });

    return requestsService.completeIfReady(approver.requestId);
  }

  async reject(token: string) {
    const approver = await this.findByToken(token);
    this.ensureProcessCanContinue(approver);
    otpService.ensureVerified(approver);

    await approver.update({
      status: "REJECTED",
      rejectedAt: new Date()
    });

    const request = await PurchaseRequest.findByPk(approver.requestId);

    if (!request) {
      throw new AppError("Solicitud no encontrada", 404, "RESOURCE_NOT_FOUND");
    }

    await request.update({
      status: "REJECTED"
    });

    return requestsService.findById(request.id);
  }

  private ensureProcessCanContinue(approver: Approver & { request?: PurchaseRequest }) {
    if (approver.status !== "PENDING") {
      throw new AppError("Esta aprobación ya fue procesada", 409, "APPROVAL_ALREADY_PROCESSED");
    }

    if (approver.request?.status === "COMPLETED") {
      throw new AppError("La solicitud ya fue completada", 409, "REQUEST_ALREADY_COMPLETED");
    }

    if (approver.request?.status === "REJECTED") {
      throw new AppError("La solicitud ya fue rechazada", 409, "REQUEST_ALREADY_REJECTED");
    }
  }
}

export const approvalsService = new ApprovalsService();
