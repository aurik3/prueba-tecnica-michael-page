import crypto from "node:crypto";
import { Op } from "sequelize";
import { env } from "../../config/env.js";
import { Approver, OtpCode } from "../../database/models.js";
import { AppError } from "../../shared/errors/AppError.js";

export class OtpService {
  generatePlainCode() {
    return crypto.randomInt(100000, 999999).toString();
  }

  hash(code: string) {
    return crypto.createHash("sha256").update(code).digest("hex");
  }

  async createForApprover(approver: Approver) {
    const code = this.generatePlainCode();
    const expiresAt = new Date(Date.now() + env.OTP_TTL_MINUTES * 60 * 1000);

    await OtpCode.create({
      approverId: approver.id,
      codeHash: this.hash(code),
      expiresAt
    });

    return {
      code,
      expiresAt
    };
  }

  async verify(approver: Approver, code: string) {
    const otp = await OtpCode.findOne({
      where: {
        approverId: approver.id,
        usedAt: null,
        expiresAt: {
          [Op.gt]: new Date()
        }
      },
      order: [["createdAt", "DESC"]]
    });

    if (!otp) {
      throw new AppError("OTP inválido o expirado", 401, "OTP_INVALID_OR_EXPIRED");
    }

    if (otp.attempts >= 3) {
      throw new AppError("OTP bloqueado por demasiados intentos", 403, "OTP_TOO_MANY_ATTEMPTS");
    }

    const matches = otp.codeHash === this.hash(code);

    if (!matches) {
      await otp.increment("attempts");
      throw new AppError("OTP inválido o expirado", 401, "OTP_INVALID_OR_EXPIRED");
    }

    const validatedUntil = new Date(Date.now() + env.OTP_TTL_MINUTES * 60 * 1000);
    await otp.update({ usedAt: new Date() });
    await approver.update({ otpValidatedUntil: validatedUntil });

    return validatedUntil;
  }

  ensureVerified(approver: Approver) {
    if (!approver.otpValidatedUntil || approver.otpValidatedUntil.getTime() < Date.now()) {
      throw new AppError("Debes validar el OTP antes de continuar", 401, "OTP_NOT_VERIFIED");
    }
  }
}

export const otpService = new OtpService();
