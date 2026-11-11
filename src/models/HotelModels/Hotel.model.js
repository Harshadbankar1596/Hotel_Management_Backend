
import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    // slug: {
    //   type: String,
    //   trim: true,
    //   lowercase: true,
    //   unique: true,
    //   required: true,
    // },

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
      country: {
        type: String,
        trim: true,
        default: "India",
      },
      pincode: {
        type: String,
        trim: true,
        default: "",
      },
    },

    logo: {
      type: String,
      default: null,
    },

    ownerName: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

HotelSchema.index({ status: 1, isDeleted: 1, createdAt: -1 });

const Hotel =
  mongoose.models.Hotel ||
  mongoose.model("Hotel", HotelSchema);

export default Hotel;
