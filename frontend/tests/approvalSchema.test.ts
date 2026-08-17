import { describe, expect, it } from "vitest";
import { otpSchema } from "../src/schemas/approvalSchema";

describe("otpSchema", () => {
  it("accepts six digit codes", () => {
    expect(otpSchema.safeParse({ code: "123456" }).success).toBe(true);
  });

  it("rejects non numeric codes", () => {
    expect(otpSchema.safeParse({ code: "12AB56" }).success).toBe(false);
  });
});
