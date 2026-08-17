import { ErrorCode, errorCodes } from "./errorCodes.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: unknown;

  constructor(message: string, statusCode = 500, code: ErrorCode = "INTERNAL_SERVER_ERROR", details: unknown = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = errorCodes[code];
    this.details = details;
  }
}
