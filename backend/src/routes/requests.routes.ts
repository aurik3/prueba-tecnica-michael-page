import { Router } from "express";
import { requestsController } from "../modules/requests/requests.controller.js";
import { asyncHandler } from "../shared/utils/asyncHandler.js";

export const requestsRouter = Router();

requestsRouter.post("/", asyncHandler(requestsController.create));
requestsRouter.get("/", asyncHandler(requestsController.list));
requestsRouter.get("/:id", asyncHandler(requestsController.detail));
requestsRouter.get("/:id/evidence.pdf", asyncHandler(requestsController.downloadEvidence));
requestsRouter.get("/:id/evidencia.pdf", asyncHandler(requestsController.downloadEvidence));
