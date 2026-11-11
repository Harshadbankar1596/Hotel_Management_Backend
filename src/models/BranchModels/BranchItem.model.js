
import mongoose from "mongoose";

const BranchMenuSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },

    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },

    prices: {
      fullPrice: {
        type: Number,
        min: [0, "Price cannot be negative"],
        default: 0,
      },
      halfPrice: {
        type: Number,
        min: [0, "Price cannot be negative"],
        default: 0,
      },
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    itemImage: {
      url: {
        type: String,
        default: null,
      },
      public_id: {
        type: String,
        default: null,
      },
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: ["veg", "nonveg"],
      default: "veg",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isMainCourse: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

BranchMenuSchema.index({
  hotelId: 1,
  branchId: 1,
  isActive: 1,
});

BranchMenuSchema.index({
  hotelId: 1,
  branchId: 1,
  category: 1,
});

const BranchMenu = mongoose.model("BranchMenu", BranchMenuSchema);

export default BranchMenu;
