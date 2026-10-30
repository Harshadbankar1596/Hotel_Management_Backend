import crypto from "node:crypto";
import { VerifyRefreshToken } from "../utils/RefreshToken/token.js";
import Session from "../models/SessionModels/Session.model.js";
import {
  ResponseLog,
  ErrorLog,
} from "../helper/GlobalResponseHandler/Response.js";
import { ClearCookie } from "../utils/cookie.js";

const VerifyRefreshTokenMiddleware = async (req, res, next) => {
  const tokenName =
    process.env.SUPER_ADMIN_TOKEN_NAME || "superadmin_token_r";

  try {
    const refreshToken = req.cookies?.[tokenName];

    if (!refreshToken) {
      return ResponseLog(res, 401, "Refresh token not found");
    }

    const decoded = VerifyRefreshToken(refreshToken);

    if (!decoded?.sub) {
      ClearCookie(res, tokenName);
      return ResponseLog(res, 401, "Invalid refresh token");
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await Session.findOne({
      userId: decoded.sub,
      userModel: "superadmin",
      tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      ClearCookie(res, tokenName);
      return ResponseLog(res, 401, "Refresh session is invalid or expired");
    }

    req.refreshToken = refreshToken;
    req.refreshTokenPayload = decoded;
    req.refreshSession = session;

    return next();
  } catch (error) {
    if (
      ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(
        error.name,
      )
    ) {
      ClearCookie(res, tokenName);
      return ResponseLog(res, 401, "Invalid or expired refresh token");
    }

    return ErrorLog(res, error, "Refresh token validation failed");
  }
};

export default VerifyRefreshTokenMiddleware;