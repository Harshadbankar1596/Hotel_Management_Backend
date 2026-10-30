import {
  ErrorLog,
  ResponseLog,
} from "../helper/GlobalResponseHandler/Response.js";

import SuperAdminModel from "../models/AdminModels/SuperAdmin.model.js";
import { VerifyAccessToken } from "../utils/RefreshToken/token.js";

async function SuperAdminAuth(req, res, next) {
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

    const superadmin = await SuperAdminModel.findById(decoded.sub)
      .select("_id email role")
      .lean();

    if (!superadmin) {
      return ResponseLog(res, 401, "SuperAdmin not found");
    }

    req.superadmin = superadmin;

    return next();
  } catch (error) {
    if (
      ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(
        error.name
      )
    ) {
      return ResponseLog(res, 401, "Invalid or expired access token");
    }

    return ErrorLog(res, error, "Error in SuperAdmin authentication");
  }
}

export default SuperAdminAuth;