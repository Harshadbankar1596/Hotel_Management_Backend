import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: [true, "Hotel is required"],
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },

    role: {
      type: String,
      enum: ["admin", "branchadmin", "waiter"],
      default: "waiter",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ hotelId: 1 });

UserSchema.index({ hotelId: 1, email: 1 }, { unique: true });

UserSchema.index({ hotelId: 1, phone: 1 }, { unique: true });

UserSchema.index({ branchId: 1, role: 1 });

export default mongoose.model("User", UserSchema);