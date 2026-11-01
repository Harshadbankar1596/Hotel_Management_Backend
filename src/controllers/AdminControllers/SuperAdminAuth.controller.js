import SuperAdminModel from "../../models/AdminModels/SuperAdmin.model.js";
import {
  SuccessLog,
  ResponseLog,
  ErrorLog,
} from "../../helper/GlobalResponseHandler/Response.js";
import {
  ValidateBody,
  ValidateEmail,
} from "../../helper/Validator/validator.js";
import {
  ComparePassword,
  CryptPassword,
} from "../../helper/bcrypt/password.js";
import {
  GenerateAccessToken,
  GenerateRefreshToken,
} from "../../utils/RefreshToken/token.js";
import { SetCookie } from "../../utils/cookie.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import Session from "../../models/SessionModels/Session.model.js";

const SuperAdminAuthController = {
  Register: async (req, res) => {
    try {
      const { email, password } = req.body;

      let validBody = ValidateBody(["email", "password"], req.body);

      if (!validBody.isValid) {
        return ResponseLog(res, 400, validBody.message);
      }

      let validEmail = ValidateEmail(email);

      if (!validEmail.isValid) {
        return ResponseLog(res, 400, validEmail.message);
      }

      let HashPassword = await CryptPassword(password);

      if (!HashPassword) {
        return ResponseLog(res, 400, "error in crypt password");
      }

      let SuperAdmin = await SuperAdminModel.create({
        email,
        password: HashPassword,
      });

      if (!SuperAdmin) {
        return ResponseLog(res, 404, "error in register admin");
      }

      return SuccessLog(res, 201, "SuperAdmin registered successfully", {
        id: SuperAdmin._id,
        email: SuperAdmin.email,
        role: SuperAdmin.role,
        createdAt: SuperAdmin.createdAt,
      });
    } catch (error) {
      return ErrorLog(res, error, "error in register superadmin");
    }
  },

  Login: async (req, res) => {
    try {
      const { email, password } = req.body;

      let validData = ValidateBody(["email", "password"], req.body);

      if (!validData.isValid) {
        return ResponseLog(res, 400, validData.message);
      }

      let validEmail = ValidateEmail(email);
      if (!validEmail.isValid) {
        return ResponseLog(res, 400, validEmail.message);
      }

      let SuperAdmin = await SuperAdminModel.findOne({ email });

      if (!SuperAdmin) {
        return ResponseLog(res, 404, "superadmin not found for this email");
      }

      let compare = await ComparePassword(password, SuperAdmin.password);

      if (!compare) {
        return ResponseLog(res, 401, "invalid password");
      }

      let RefreshToken = GenerateRefreshToken(SuperAdmin);
      if (!RefreshToken) {
        return ResponseLog(res, 400, "erro in gen(r) token");
      }
      let AccessToken = GenerateAccessToken(SuperAdmin);
      if (!AccessToken) {
        return ResponseLog(res, 400, "erro in gen(a) token");
      }

      const tokenHash = crypto
        .createHash("sha256")
        .update(RefreshToken)
        .digest("hex");

      const decodedToken = jwt.decode(RefreshToken);

      if (!decodedToken?.exp) {
        return ResponseLog(res, 500, "Invalid refresh token expiry");
      }

      await Session.findOneAndUpdate(
        {
          userId: SuperAdmin._id,
        },
        {
          $set: {
            tokenHash,
            expiresAt: new Date(decodedToken.exp * 1000),
            revokedAt: new Date(),
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        },
      );
      
      let tokenName =
        process.env.SUPER_ADMIN_TOKEN_NAME || "superadmin_token_r";

      SetCookie(res, tokenName, RefreshToken);

      return SuccessLog(res, 200, "Login successful", {
        AccessToken,
        SuperAdmin: {
          _id: SuperAdmin._id,
          email: SuperAdmin.email,
          role: SuperAdmin.role,
        },
      });
    } catch (error) {
      return ErrorLog(res, error, "error in login superadmin");
    }
  },
  
  Refresh: async (req, res) => {
    try {
      const payload = req.refreshTokenPayload;
      const oldSession = req.refreshSession;
      const oldToken = req.refreshToken;

      if (!payload?.sub || !oldSession || !oldToken) {
        return ResponseLog(res, 401, "Invalid refresh session");
      }

      const SuperAdmin = await SuperAdminModel.findById(payload.sub).select(
        "_id email role",
      );

      if (!SuperAdmin) {
        return ResponseLog(res, 401, "SuperAdmin not found");
      }

      const RefreshToken = GenerateRefreshToken(SuperAdmin);
      const AccessToken = GenerateAccessToken(SuperAdmin);

      const decodedToken = jwt.decode(RefreshToken);

      if (!decodedToken?.exp) {
        return ResponseLog(res, 500, "Invalid refresh token expiry");
      }

      const tokenHash = crypto
        .createHash("sha256")
        .update(RefreshToken)
        .digest("hex");

      const expiresAt = new Date(decodedToken.exp * 1000);

      const session = await Session.findOneAndUpdate(
        {
          _id: oldSession._id,
          userId: SuperAdmin._id,
          expiresAt: { $gt: new Date() },
        },
        {
          $set: {
            tokenHash,
            expiresAt,
            revokedAt: new Date(),
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!session) {
        return ResponseLog(res, 401, "Refresh session already used or expired");
      }

      const tokenName =
        process.env.SUPER_ADMIN_TOKEN_NAME || "superadmin_token_r";

      SetCookie(res, tokenName, RefreshToken);

      return SuccessLog(res, 200, "Token refreshed successfully", {
        AccessToken,
        SuperAdmin: {
          _id: SuperAdmin._id,
          email: SuperAdmin.email,
          role: SuperAdmin.role,
        },
      });
    } catch (error) {
      return ErrorLog(res, error, "Failed to refresh token");
    }
  },
};

export default SuperAdminAuthController;
