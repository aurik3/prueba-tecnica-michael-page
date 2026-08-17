import { Router } from "express";
import { approvalsRouter } from "./approvals.routes.js";
import { requestsRouter } from "./requests.routes.js";

export const apiRouter = Router();

apiRouter.use("/requests", requestsRouter);
apiRouter.use("/approvals", approvalsRouter);
apiRouter.use("/solicitudes", requestsRouter);
apiRouter.use("/aprobaciones", approvalsRouter);
