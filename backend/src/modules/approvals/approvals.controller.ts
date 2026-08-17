import { Request, Response } from "express";
import { approvalsService } from "./approvals.service.js";
import { serializeApproval } from "./approvals.serializer.js";
import { tokenParamSchema, verifyOtpSchema } from "./approvals.schemas.js";
import { serializeRequest } from "../requests/requests.serializer.js";
import { ok } from "../../shared/utils/apiResponse.js";

export class ApprovalsController {
  detail = async (req: Request, res: Response) => {
    const { token } = tokenParamSchema.parse(req.params);
    const approval = await approvalsService.findByToken(token);
    return ok(res, serializeApproval(approval));
  };

  requestOtp = async (req: Request, res: Response) => {
    const { token } = tokenParamSchema.parse(req.params);
    const otp = await approvalsService.requestOtp(token);
    return ok(res, {
      expiresAt: otp.expiresAt,
      delivery: "simulated",
      code: otp.code
    });
  };

  verifyOtp = async (req: Request, res: Response) => {
    const { token } = tokenParamSchema.parse(req.params);
    const input = verifyOtpSchema.parse(req.body);
    const result = await approvalsService.verifyOtp(token, input.code);
    return ok(res, result);
  };

  approve = async (req: Request, res: Response) => {
    const { token } = tokenParamSchema.parse(req.params);
    const request = await approvalsService.approve(token);
    return ok(res, serializeRequest(request));
  };

  reject = async (req: Request, res: Response) => {
    const { token } = tokenParamSchema.parse(req.params);
    const request = await approvalsService.reject(token);
    return ok(res, serializeRequest(request));
  };
}

export const approvalsController = new ApprovalsController();
