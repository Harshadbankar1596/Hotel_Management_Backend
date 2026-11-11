
import mongoose from "mongoose";

const Table = new mongoose.Schema(
  {
    tableName: {
      type: String,
      required: true,
      trim: true,
    },

    tableNo: {
      type: Number,
      required: true,
      min: 1,
    },

    floorNo: {
      type: Number,
      required: true,
      min: 1,
    },

    tableType: {
      type: String,
      enum: ["A/C", "Non A/C", "bar"],
      default: "Non A/C",
    },

    capacity: {
      type: Number,
      default: 4,
      min: 1,
    },

    tableStatus: {
      type: String,
      enum: [
        "reserved",
        "booked",
        "readytopayment",
        "not-reserved",
      ],
      default: "not-reserved",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const TableSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Hotel",
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Branch",
    },

    Tables: {
      type: [Table],
      default: [],
    },
  },
  { timestamps: true }
);

TableSchema.index(
  { hotelId: 1, branchId: 1 },
  { unique: true }
);

TableSchema.index({
  branchId: 1,
  "Tables.tableNo": 1,
});

export default mongoose.model("Table", TableSchema);
