import { describe, expect, it } from "vitest";
import { otpService } from "../src/modules/otp/otp.service.js";

describe("otpService", () => {
  it("generates six digit codes", () => {
    const code = otpService.generatePlainCode();

    expect(code).toMatch(/^\d{6}$/);
  });

  it("hashes the same code consistently", () => {
    const first = otpService.hash("123456");
    const second = otpService.hash("123456");

    expect(first).toBe(second);
    expect(first).toHaveLength(64);
  });
});
