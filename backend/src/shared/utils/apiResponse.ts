import { Response } from "express";

export const ok = <T>(res: Response, data: T, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};
