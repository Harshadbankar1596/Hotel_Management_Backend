import jwt from "jsonwebtoken";
import crypto from "node:crypto";

export const GenerateAccessToken = (admin) => {
  return jwt.sign(
    {
      sub: admin._id.toString(),
      role: admin.role,
      type: "access",
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
  );
};

export const GenerateRefreshToken = (admin) => {
  return jwt.sign(
    {
      sub: admin._id.toString(),
      type: "refresh",
      jti: crypto.randomUUID(),
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  );
};

export const VerifyAccessToken = (token) => {
  const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (payload.type !== "access") {
    throw new Error("Invalid access token");
  }

  return payload;
};

export const VerifyRefreshToken = (token) => {
  const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  if (payload.type !== "refresh" || !payload.jti) {
    throw new Error("Invalid refresh token");
  }

  return payload;
};

export const HashRefreshToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};