
import mongoose from "mongoose";

const HotelBranchSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: [true, "Hotel ID is required"],
      index: true,
    },

    branchName: {
      type: String,
      required: [true, "Branch name is required"],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    branchCode: {
      type: String,
      trim: true,
      uppercase: true,
      required: [true, "Branch code is required"],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    address: {
      street: {
        type: String,
        trim: true,
        default: "",
      },
      city: {
        type: String,
        trim: true,
        default: "",
      },
      state: {
        type: String,
        trim: true,
        default: "",
      },
     
      pincode: {
        type: String,
        trim: true,
        default: "",
      },
    },


    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

HotelBranchSchema.index(
  { hotelId: 1, branchCode: 1 },
  { unique: true }
);

HotelBranchSchema.index({
  hotelId: 1,
  status: 1,
  isDeleted: 1,
  createdAt: -1,
});

const HotelBranch =
  mongoose.models.HotelBranch ||
  mongoose.model("HotelBranch", HotelBranchSchema);

export default HotelBranch;