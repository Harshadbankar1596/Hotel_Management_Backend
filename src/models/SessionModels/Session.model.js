
import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    userModel: {
      type: String,
      required: true,
      enum: ["superadmin", "admin", "user"],
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

SessionSchema.index({ userId: 1, userModel: 1 });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Session", SessionSchema);
