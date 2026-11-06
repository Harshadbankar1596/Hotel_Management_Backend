import mongoose from "mongoose";
import {
  ErrorLog,
  ResponseLog,
  SuccessLog,
} from "../../helper/GlobalResponseHandler/Response.js";
import {
  ValidateBody,
  ValidateEmail,
  ValidatePhone,
} from "../../helper/Validator/validator.js";
import BranchModel from "../../models/BranchModels/branch.model.js";
import HotelModel from "../../models/HotelModels/Hotel.model.js";

const BranchController = {
  CreateBranch: async (req, res) => {
    try {
      const { hotelId, branchName, branchCode, email, phone, address } =
        req.body;

      const validBody = ValidateBody(
        ["hotelId", "branchName", "branchCode", "address"],
        req.body,
      );

      if (!validBody.isValid) {
        return ResponseLog(res, 400, validBody.message);
      }

      if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        return ResponseLog(res, 400, "Invalid Hotel ID");
      }

      if (!address || typeof address !== "object" || Array.isArray(address)) {
        return ResponseLog(res, 400, "Invalid Address");
      }

      const validAddress = ValidateBody(
        ["street", "city", "state", "pincode"],
        address,
      );

      if (!validAddress.isValid) {
        return ResponseLog(res, 400, validAddress.message);
      }

      if (email) {
        const validEmail = ValidateEmail(email);

        if (!validEmail.isValid) {
          return ResponseLog(res, 400, validEmail.message);
        }
      }

      if (phone) {
        const validPhone = ValidatePhone(phone);

        if (!validPhone.isValid) {
          return ResponseLog(res, 400, validPhone.message);
        }
      }

      const normalizedBranchName = branchName.trim();
      const normalizedBranchCode = branchCode.trim().toUpperCase();

      if (
        normalizedBranchName.length < 2 ||
        normalizedBranchName.length > 150
      ) {
        return ResponseLog(
          res,
          400,
          "Branch name must be between 2 and 150 characters",
        );
      }

      if (!normalizedBranchCode) {
        return ResponseLog(res, 400, "Branch code is required");
      }

      const hotel = await HotelModel.findById(hotelId).select("_id").lean();

      if (!hotel) {
        return ResponseLog(res, 404, "Hotel Not Found");
      }

      const existingBranch = await BranchModel.findOne({
        hotelId,
        branchCode: normalizedBranchCode,
      }).lean();

      if (existingBranch) {
        return ResponseLog(res, 409, "Branch Code Already Exists");
      }

      const branch = await BranchModel.create({
        hotelId,
        branchName: normalizedBranchName,
        branchCode: normalizedBranchCode,
        email: email?.trim().toLowerCase() || null,
        phone: phone?.trim() || null,
        address: {
          street: address.street.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          pincode: address.pincode.trim(),
        },
      });

      return SuccessLog(res, 201, "Branch Created Successfully", branch);
    } catch (error) {
      if (error.code === 11000) {
        return ResponseLog(res, 409, "Branch Code Already Exists");
      }

      return ErrorLog(res, error, "Error in Create Branch");
    }
  },
};

export default BranchController;
