import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
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

    ItemImage : {
        url : {type : String , default : null},
        public_id : {type : String , default : null}
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
    },

    isMainCourse: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const BranchItemSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Hotel is required"],
      ref: "Hotel",
      index: true,
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Branch is required"],
      ref: "Branch",
      index: true,
    },

    FoodItems: {
      type: [ItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

BranchItemSchema.index({ hotelId: 1, branchId: 1 }, { unique: true });

const BranchMenu = mongoose.model("BranchMenu", BranchItemSchema);

export default BranchMenu;