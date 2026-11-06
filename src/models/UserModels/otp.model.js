import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 6,
    },

    expire: {
      type: Date,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

OtpSchema.index({ userId: 1 });

OtpSchema.index(
  { expire: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.model("otp", OtpSchema);