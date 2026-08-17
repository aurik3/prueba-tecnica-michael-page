import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("app", () => {
  it("exposes health endpoint", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("exposes swagger document", async () => {
    const response = await request(app).get("/api/docs.json");

    expect(response.status).toBe(200);
    expect(response.body.paths["/solicitudes"]).toBeDefined();
    expect(response.body.paths["/aprobaciones/{token}/approve"]).toBeDefined();
  });
});
