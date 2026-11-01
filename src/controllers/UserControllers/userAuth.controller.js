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
} from "../../utils/RefreshToken/token.js";
import { SetCookie } from "../../utils/cookie.js";
import Session from "../../models/SessionModels/Session.model.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

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

      // otp verify logic here
      const staticOtp = 1234;

      if (otp !== staticOtp) {
        return ResponseLog(res, 400, "Invalid OTP");
      }

      const User = await UserModel.findOne({ email }).lean();

      if (!User) {
        return Response(res, 401, "User Not Found");
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
};

export default UserAuthController;
