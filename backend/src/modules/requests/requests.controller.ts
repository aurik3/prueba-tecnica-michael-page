import { Request, Response } from "express";
import { evidenceService } from "../evidence/evidence.service.js";
import { createRequestSchema } from "./requests.schemas.js";
import { requestsService } from "./requests.service.js";
import { serializeRequest } from "./requests.serializer.js";
import { ok } from "../../shared/utils/apiResponse.js";

export class RequestsController {
  create = async (req: Request, res: Response) => {
    const input = createRequestSchema.parse(req.body);
    const request = await requestsService.create(input);
    return ok(res, serializeRequest(request), 201);
  };

  list = async (req: Request, res: Response) => {
    const requests = await requestsService.list();
    return ok(res, requests.map((request) => serializeRequest(request)));
  };

  detail = async (req: Request, res: Response) => {
    const request = await requestsService.findById(String(req.params.id));
    return ok(res, serializeRequest(request));
  };

  downloadEvidence = async (req: Request, res: Response) => {
    const request = await requestsService.findEvidenceRequest(String(req.params.id));
    const filePath = await evidenceService.getReadableFile(request);
    return res.download(filePath, `evidencia-${request.id}.pdf`);
  };
}

export const requestsController = new RequestsController();
