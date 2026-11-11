import SuperAdminModel from "../models/AdminModels/SuperAdmin.model.js";
import UserModel from "../models/UserModels/user.model.js";

import { VerifyAccessToken } from "../helper/RefreshToken/token.js";

import {
  ErrorLog,
  ResponseLog,
} from "../helper/GlobalResponseHandler/Response.js";

const AdminOrSuperAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
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

    let user = await SuperAdminModel.findById(decoded.sub)
      .select("_id email role")
      .lean();

    if (user) {
      if (user.role !== "superadmin") {
        return ResponseLog(res, 403, "Permission denied");
      }

      req.superadmin = user;
      req.authUser = user;

      return next();
    }

    user = await UserModel.findById(decoded.sub)
      .select("_id email role")
      .lean();

    if (!user) {
      return ResponseLog(res, 401, "User not found");
    }

    if (!["admin", "superadmin"].includes(user.role)) {
      return ResponseLog(res, 403, "Permission denied");
    }

    req.user = user;
    req.authUser = user;
    console.log("user => " , user.role)

    return next();
  } catch (error) {
    if (
      ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(
        error.name,
      )
    ) {
      return ResponseLog(res, 401, "Invalid or expired access token");
    }

    return ErrorLog(res, error, "Error in Admin/SuperAdmin authentication");
  }
};

export default AdminOrSuperAdminAuth;
