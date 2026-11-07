
import BranchConfigModel from "../../models/BranchModels/Configration.model.js";
import {
  ErrorLog,
  ResponseLog,
  SuccessLog,
} from "../../helper/GlobalResponseHandler/Response.js";
import {
  ValidateBody,
  ValidateEnum,
} from "../../helper/Validator/validator.js";
import HotelModel from "../../models/HotelModels/Hotel.model.js";
import BranchModel from "../../models/BranchModels/branch.model.js";
import mongoose from "mongoose";

const BranchConfigController = {
  createConfig: async (req, res) => {
    try {
      const { hotelId, branchId, taxes } = req.body;

      const validBody = ValidateBody(
        ["hotelId", "branchId", "taxes"],
        req.body
      );

      if (!validBody.isValid) {
        return ResponseLog(res, 400, validBody.message);
      }

      if (!mongoose.isValidObjectId(hotelId)) {
        return ResponseLog(res, 400, "Invalid hotel");
      }

      if (!mongoose.isValidObjectId(branchId)) {
        return ResponseLog(res, 400, "Invalid branch");
      }

      if (!Array.isArray(taxes)) {
        return ResponseLog(res, 400, "Taxes must be an array");
      }

      for (let i = 0; i < taxes.length; i++) {
        const tax = taxes[i];

        const validTaxes = ValidateBody(
          ["taxName", "taxType", "taxValue"],
          tax
        );

        if (!validTaxes.isValid) {
          return ResponseLog(
            res,
            400,
            `Tax ${i + 1}: ${validTaxes.message}`
          );
        }

        const validType = ValidateEnum(
          {
            taxType: ["fixed", "percentage"],
          },
          tax
        );

        if (!validType.isValid) {
          return ResponseLog(
            res,
            400,
            `Tax ${i + 1}: ${validType.message}`
          );
        }

        if (
          typeof tax.taxValue !== "number" ||
          !Number.isFinite(tax.taxValue) ||
          tax.taxValue < 0
        ) {
          return ResponseLog(
            res,
            400,
            `Tax ${i + 1}: Invalid taxValue`
          );
        }

        if (
          tax.taxType === "percentage" &&
          tax.taxValue > 100
        ) {
          return ResponseLog(
            res,
            400,
            `Tax ${i + 1}: Percentage cannot exceed 100`
          );
        }
      }

      const Hotel = await HotelModel.findById(hotelId)
        .select("_id")
        .lean();

      if (!Hotel) {
        return ResponseLog(res, 404, "Hotel Not Found");
      }

      const Branch = await BranchModel.findOne({
        _id: branchId,
        hotelId,
      }).select("_id").lean();

      if (!Branch) {
        return ResponseLog(res, 404, "Branch Not Found");
      }

      const existingConfig = await BranchConfigModel.findOne({
        hotelId,
        branchId,
      }).select("_id").lean();

      if (existingConfig) {
        return ResponseLog(res, 409, "Branch Configuration Already Exists");
      }

      await BranchConfigModel.create({
        hotelId,
        branchId,
        taxes,
      });

      return SuccessLog(res, 201, "Config Added");
    } catch (error) {
      ErrorLog(res, error, "Error in Create Config");
    }
  },
};

export default BranchConfigController;
