
import mongoose from "mongoose";

const SuperAdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role : {
        type : String,
        enum : ["admin" , "superadmin" , "user"],
        default : "user"
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SuperAdmin", SuperAdminSchema);