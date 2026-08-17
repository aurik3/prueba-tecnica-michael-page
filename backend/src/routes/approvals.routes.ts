import { Router } from "express";
import { approvalsController } from "../modules/approvals/approvals.controller.js";
import { asyncHandler } from "../shared/utils/asyncHandler.js";

export const approvalsRouter = Router();

approvalsRouter.get("/:token", asyncHandler(approvalsController.detail));
approvalsRouter.post("/:token/request-otp", asyncHandler(approvalsController.requestOtp));
approvalsRouter.post("/:token/verify-otp", asyncHandler(approvalsController.verifyOtp));
approvalsRouter.post("/:token/approve", asyncHandler(approvalsController.approve));
approvalsRouter.post("/:token/reject", asyncHandler(approvalsController.reject));
