
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
import app from "../src/app.js";
import Hotel from "../src/models/HotelModels/Hotel.model.js";

describe("Hotel API E2E", () => {
  let createdHotelId;

  beforeAll(async () => {
    if (!process.env.TEST_MONGO_URI) {
      throw new Error("TEST_MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.TEST_MONGO_URI);
  });

  afterAll(async () => {
    if (createdHotelId) {
      await Hotel.findByIdAndDelete(createdHotelId);
    }

    await mongoose.connection.close();
  });

  it("should create a hotel successfully", async () => {
    const payload = {
      name: "Royal Hotel",
      email: "royal@example.com",
      phone: "9876543210",
      address: {
        street: "Main Road",
        city: "Sambhaji Nagar",
        state: "Maharashtra",
        country: "India",
        pincode: "431001",
      },
      ownerName: "Harshad",
    };

    const response = await request(app)
      .post("/api/v1/hotel/create")
      .set("Cookie", [
        `vendor_token=${process.env.TEST_VENDOR_TOKEN}`,
      ])
      .send(payload);

    console.log("Status:", response.status);
    console.log("Response:", response.body);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Hotel created successfully");
    expect(response.body.data.name).toBe(payload.name);
    expect(response.body.data.email).toBe(payload.email);

    createdHotelId = response.body.data._id;

    const savedHotel = await Hotel.findById(createdHotelId);

    expect(savedHotel).not.toBeNull();
    expect(savedHotel.name).toBe(payload.name);
    expect(savedHotel.address.city).toBe(payload.address.city);
  });
});