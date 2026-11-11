import UserModel from "../../models/UserModels/user.model.js";
import HotelModel from "../../models/HotelModels/Hotel.model.js";
import HotelBranchModel from "../../models/BranchModels/branch.model.js";
import { ValidateBody } from "../../helper/Validator/validator.js";
import {
  ValidateEmail,
  ValidatePhone,
} from "../../helper/Validator/validator.js";
import {
  ErrorLog,
  ResponseLog,
  SuccessLog,
} from "../../helper/GlobalResponseHandler/Response.js";
import {
  GenerateAccessToken,
  GenerateRefreshToken,
} from "../../helper/RefreshToken/token.js";
import { SetCookie } from "../../helper/cookie.js";
import Session from "../../models/SessionModels/Session.model.js";
import OtpModel from "../../models/UserModels/otp.model.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import otpTemplate from "../../utils/otpTemplate.js";
import sendEmail from "../../utils/sendEmail.js";
import { randomInt } from "crypto";

const UserAuthController = {
  RegisterUser: async (req, res) => {
    try {
      const { email, phone, role, hotelId, name, branchId } = req.body;

      const validBody = ValidateBody(
        ["email", "phone", "role", "hotelId", "name"],
        req.body,
      );

      if (!validBody.isValid) {
        return ResponseLog(res, 400, validBody.message);
      }

      const validEmail = ValidateEmail(email);
      const validPhone = ValidatePhone(phone);

      if (!validEmail.isValid) {
        return ResponseLog(res, 400, validEmail.message);
      }

      if (!validPhone.isValid) {
        return ResponseLog(res, 400, validPhone.message);
      }

      const normalizedRole = role?.toLowerCase();

      if (!["admin", "branchadmin", "waiter"].includes(normalizedRole)) {
        return ResponseLog(res, 400, "Invalid Role");
      }

      const hotel = await HotelModel.findOne({
        _id: hotelId,
        status: "active",
        isDeleted: false,
      })
        .select("_id")
        .lean();

      if (!hotel) {
        return ResponseLog(res, 404, "Hotel Not Found or Inactive");
      }

      const branch = await HotelBranchModel.findOne({
        _id: branchId,
        hotelId: hotelId,
      });

      if (!branch) {
        return ResponseLog(res, 404, "Branch Not Found");
      }

      if (["branchadmin", "waiter"].includes(normalizedRole) && !branchId) {
        return ResponseLog(res, 400, "Branch ID is required");
      }

      let validBranchId = null;

      if (branchId) {
        const branch = await HotelBranchModel.findOne({
          _id: branchId,
          hotelId,
          status: "active",
          isDeleted: false,
        })
          .select("_id")
          .lean();

        if (!branch) {
          return ResponseLog(res, 404, "Branch Not Found");
        }

        validBranchId = branch._id;
      }

      if (normalizedRole === "admin" && branchId) {
        return ResponseLog(
          res,
          400,
          "Hotel Admin cannot be assigned to a branch",
        );
      }

      const existingUser = await UserModel.findOne({
        $or: [{ email }, { phone }],
      })
        .select("_id")
        .lean();

      if (existingUser) {
        return ResponseLog(res, 409, "Email or Phone Already Exists");
      }

      const User = await UserModel.create({
        name,
        email,
        phone,
        role: normalizedRole,
        hotelId,
        branchId: validBranchId,
      });

      return SuccessLog(res, 201, "User Registered Successfully", User);
    } catch (error) {
      return ErrorLog(res, error, "Error In Register Hotel User");
    }
  },

  LoginUser: async (req, res) => {
    try {
      const { email, otp } = req.body;

      const validBody = ValidateBody(["email", "otp"], req.body);

      if (!validBody.isValid) {
        return ResponseLog(res, 400, validBody.message);
      }

      const validEmail = ValidateEmail(email);
      if (!validEmail.isValid) {
        return ResponseLog(res, 400, validEmail.message);
      }

      const User = await UserModel.findOne({ email }).lean();

      if (!User) {
        return Response(res, 401, "User Not Found");
      }

      // otp verify logic here
      const validOpt = await OtpModel.findOne({
        otp,
        userId: User._id,
        expire: { $gt: new Date() },
      });

      if (!validOpt) {
        return ResponseLog(res, 400, "Invalid or expired OTP");
      }

      let RefreshToken = GenerateRefreshToken(User);
      if (!RefreshToken) {
        return ResponseLog(res, 400, "erro in gen(r) token");
      }
      let AccessToken = GenerateAccessToken(User);
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
          userId: User._id,
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
      await OtpModel.findByIdAndDelete(validOpt._id);

      let TokenName = process.env.USER_TOKEN_NAME || "user_token_r";

      SetCookie(res, TokenName, RefreshToken);

      return SuccessLog(res, 200, "Login successful", {
        AccessToken,
        User,
      });
    } catch (error) {
      return ErrorLog(res, error, "error in login user");
    }
  },

  SendOtp: async (req, res) => {
    try {
      const { email } = req.body;

      const validBody = ValidateBody(["email"], req.body);
      if (!validBody.isValid) {
        return ResponseLog(res, 400, validBody.message);
      }

      const normalizedEmail = email.trim().toLowerCase();

      const user = await UserModel.findOne({ email: normalizedEmail })
        .select("_id email")
        .lean();

      if (!user) {
        return ResponseLog(res, 404, "User Not Found");
      }

      const newOtp = randomInt(1000, 10000).toString();
      const expire = new Date(Date.now() + 5 * 60 * 1000);

      const otp = await OtpModel.findOneAndUpdate(
        { userId: user._id },
        {
          otp: newOtp,
          expire,
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      );

      try {
        await sendEmail({
          to: user.email,
          subject: "Your OTP Verification Code",
          html: otpTemplate(newOtp),
        });
      } catch (error) {
        await OtpModel.findByIdAndDelete(otp._id);
        throw error;
      }

      return SuccessLog(res, 200, "OTP sent to your email");
    } catch (error) {
      return ErrorLog(res, error, "Error in sending OTP");
    }
  },

  Refresh: async (req, res) => {
    try {
      const payload = req.refreshTokenPayload;
      const oldSession = req.refreshSession;
      const oldToken = req.refreshToken;

      if (!payload.sub || !oldSession || !oldToken) {
        return ResponseLog(res, 401, "Invalid Resfresh Token");
      }

      const User = await UserModel.findById(payload.sub)
        .select("_id role")
        .lean();

      if (!User) {
        return ResponseLog(res, 401, "User Not Found");
      }

      const RefreshToken = GenerateRefreshToken(User);
      const AccessToken = GenerateAccessToken(User);

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
          userId: User._id,
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

      const tokenName = process.env.USER_TOKEN_NAME || "user_token_r";

      SetCookie(res, tokenName, RefreshToken);

      return SuccessLog(res, 200, "Token refreshed successfully", {
        AccessToken,
        User: {
          _id: User._id,
          role: User.role,
        },
      });
    } catch (error) {
      return ErrorLog(res, error, "Failed to refresh token");
    }
  },
};

export default UserAuthController;
