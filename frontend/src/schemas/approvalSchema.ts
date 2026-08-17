import { z } from "zod";

export const otpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "El OTP debe tener 6 dígitos")
});

export type OtpInput = z.infer<typeof otpSchema>;
