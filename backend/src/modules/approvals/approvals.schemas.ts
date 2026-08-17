import { z } from "zod";

export const tokenParamSchema = z.object({
  token: z.string().uuid()
});

export const verifyOtpSchema = z.object({
  code: z.string().regex(/^\d{6}$/)
});

export type TokenParamInput = z.infer<typeof tokenParamSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
