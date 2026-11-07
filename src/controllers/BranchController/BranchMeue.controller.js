import BranchMenuModel from "../../models/BranchModels/BranchItem.model.js";
import HotelModel from "../../models/HotelModels/Hotel.model.js";
import BranchModel from "../../models/BranchModels/branch.model.js";
import {
  ErrorLog,
  ResponseLog,
  SuccessLog,
} from "../../helper/GlobalResponseHandler/Response.js";
import { ValidateBody } from "../../helper/Validator/validator.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.utils.js";
import mongoose from "mongoose";

const BranchMenueController = {
  addMenue: async (req, res) => {
    let uploadedImage = null;

    try {
      const { hotelId, branchId, FoodItem } = req.body;

      const validBody = ValidateBody(
        ["hotelId", "branchId", "FoodItem"],
        req.body,
      );

      if (!validBody.isValid) {
        return ResponseLog(res, 400, validBody.message);
      }

      if (
        !mongoose.isValidObjectId(hotelId) ||
        !mongoose.isValidObjectId(branchId)
      ) {
        return ResponseLog(res, 400, "Invalid Hotel or Branch");
      }

      const validItem = ValidateBody(
        ["itemName", "description", "category", "type"],
        FoodItem,
      );

      if (!validItem.isValid) {
        return ResponseLog(res, 400, validItem.message);
      }

      if (!["veg", "nonveg"].includes(FoodItem.type)) {
        return ResponseLog(res, 400, "Invalid Food Type");
      }

      const [hotelExists, branchExists] = await Promise.all([
        HotelModel.exists({ _id: hotelId }),
        BranchModel.exists({ _id: branchId, hotelId }),
      ]);

      if (!hotelExists) {
        return ResponseLog(res, 404, "Hotel Not Found");
      }

      if (!branchExists) {
        return ResponseLog(res, 404, "Branch Not Found");
      }

      if (req.file) {
        uploadedImage = await uploadToCloudinary(req.file, "menu-items");
      }


      // remove  this condition in production
      if (uploadedImage?.public_id) {
        await deleteFromCloudinary(uploadedImage.public_id).catch(() => {});
      }


      const itemObj = {
        itemName: FoodItem.itemName,
        prices: {
          fullPrice: Number(FoodItem.prices?.fullPrice) || 0,
          halfPrice: Number(FoodItem.prices?.halfPrice) || 0,
        },
        description: FoodItem.description,
        ItemImage: uploadedImage,
        category: FoodItem.category,
        type: FoodItem.type,
        isActive: FoodItem.isActive ?? true,
        isMainCourse: FoodItem.isMainCourse ?? false,
      };

      await BranchMenuModel.findOneAndUpdate(
        { hotelId, branchId },
        {
          $setOnInsert: {
            hotelId,
            branchId,
          },
          $push: {
            FoodItems: itemObj,
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      );

      return SuccessLog(res, 201, "Menu Item Added Successfully");
    } catch (error) {
      if (uploadedImage?.public_id) {
        await deleteFromCloudinary(uploadedImage.public_id).catch(() => {});
      }

      return ErrorLog(res, error, "Error In Add FoodItem");
    }
  },
};

export default BranchMenueController;
