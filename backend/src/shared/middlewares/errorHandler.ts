import { ErrorRequestHandler } from "express";
import { ValidationError } from "sequelize";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      details: error.details
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Los datos enviados no son válidos",
      code: "VALIDATION_ERROR",
      details: error.flatten()
    });
    return;
  }

  if (error instanceof ValidationError) {
    res.status(400).json({
      success: false,
      message: "Error de validación de base de datos",
      code: "VALIDATION_ERROR",
      details: error.errors.map((item) => ({
        path: item.path,
        message: item.message
      }))
    });
    return;
  }

  const shouldExpose = process.env.NODE_ENV !== "production";

  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    code: "INTERNAL_SERVER_ERROR",
    details: shouldExpose ? { message: error instanceof Error ? error.message : String(error) } : null
  });
};
