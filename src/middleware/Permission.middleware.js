import {
  ResponseLog,
  ErrorLog,
} from "../helper/GlobalResponseHandler/Response.js";

const PermissionAuth = async (req, res, next) => {
  try {
    const user = req.user || req.superadmin;
    if (!user) {
      return ResponseLog(res, 401, "User not found");
    }
    if (user.role === "admin" || user.role === "superadmin") {
      return next();
    }
    return ResponseLog(res, 403, "Permission denied");
  } catch (error) {
    return ErrorLog(res, error, "error in userPermition auth");
  }
};

export default PermissionAuth;