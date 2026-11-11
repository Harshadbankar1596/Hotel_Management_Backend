import {
  ErrorLog,
  ResponseLog,
} from "../helper/GlobalResponseHandler/Response.js";

import { VerifyAccessToken } from "../helper/RefreshToken/token.js";
import UserModel from "../models/UserModels/user.model.js";

async function UserAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ResponseLog(res, 401, "Access token not found");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return ResponseLog(res, 401, "Access token not found");
    }

    const decoded = VerifyAccessToken(token);

    if (!decoded?.sub) {
      return ResponseLog(res, 401, "Invalid access token");
    }

    const User = await UserModel.findById(decoded.sub)
      .select("_id email role")
      .lean();

    if (!User) {
      return ResponseLog(res, 401, "User not found");
    }

    req.user = User;

    return next();
  } catch (error) {
    if (
      ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(
        error.name,
      )
    ) {
      return ResponseLog(res, 401, "Invalid or expired access token");
    }

    return ErrorLog(res, error, "Error in User authentication");
  }
}

export default UserAuth;
