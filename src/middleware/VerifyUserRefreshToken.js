import { VerifyRefreshToken } from "../helper/RefreshToken/token.js";
import Session from "../models/SessionModels/Session.model.js";
import {
  ResponseLog,
  ErrorLog,
} from "../helper/GlobalResponseHandler/Response.js";
import { ClearCookie } from "../helper/cookie.js";
import crypto from "node:crypto";


const VerifyUserRefreshToken = async (req, res, next) => {
  try {
    const tokenName = process.env.USER_TOKEN_NAME || "user_token_r";

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

export default VerifyUserRefreshToken;