
import "dotenv/config";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
} from "vitest";

import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app.js";
import SuperAdmin from "../../src/models/AdminModels/SuperAdmin.model.js";

describe("SuperAdmin Auth E2E", () => {
  const payload = {
    email: `super${Date.now()}@gmail.com`,
    password: "Super@12345",
  };

  beforeAll(async () => {
    if (!process.env.TEST_MONGO_URI) {
      throw new Error("TEST_MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.TEST_MONGO_URI);
  });

  afterAll(async () => {
    await SuperAdmin.deleteOne({ email: payload.email });
    await mongoose.connection.close();
  });

  it("should register SuperAdmin successfully", async () => {
    const response = await request(app)
      .post("/api/v1/superadmin/register")
      .send(payload);

    console.log("Register:", response.status, response.body);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    const savedAdmin = await SuperAdmin.findOne({
      email: payload.email,
    }).select("+password");

    expect(savedAdmin).not.toBeNull();
    expect(savedAdmin.password).not.toBe(payload.password);
  });

  it("should login SuperAdmin successfully", async () => {
    const response = await request(app)
      .post("/api/v1/superadmin/login")
      .send(payload);

    console.log("Login:", response.status, response.body);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.AccessToken).toBeTruthy();
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  it("should reject incorrect password", async () => {
    const response = await request(app)
      .post("/api/v1/superadmin/login")
      .send({
        email: payload.email,
        password: "WrongPassword123",
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
