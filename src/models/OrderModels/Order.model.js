
import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      default: null,
    },

    orderNumber: {
      type: String,
      trim: true,
    },

    orderType: {
      type: String,
      enum: ["dine-in", "takeaway", "delivery"],
      default: "dine-in",
    },

    orderItems: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "BranchMenu"
    }],

    subtotal: {
      type: Number,
      min: 0,
      default: 0,
    },

    totalTax: {
      type: Number,
      min: 0,
      default: 0,
    },

    discountType: {
      type: String,
      enum: ["flat", "percentage"],
      default: "flat",
    },

    discountValue: {
      type: Number,
      min: 0,
      default: 0,
    },

    discountAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    deliveryCharge: {
      type: Number,
      min: 0,
      default: 0,
    },

    grandTotal: {
      type: Number,
      min: 0,
      default: 0,
    },

    paidAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    dueAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid", "refunded"],
      default: "unpaid",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "card", "online", "mixed"],
      default: "cash",
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "served",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    kotStatus: {
      type: String,
      enum: ["pending", "sent", "preparing", "completed"],
      default: "pending",
    },

    customerName: {
      type: String,
      trim: true,
      default: "",
    },

    customerPhone: {
      type: String,
      trim: true,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

OrderSchema.index({
  hotelId: 1,
  branchId: 1,
  createdAt: -1,
});

OrderSchema.index({
  hotelId: 1,
  branchId: 1,
  orderStatus: 1,
});

OrderSchema.index({
  hotelId: 1,
  branchId: 1,
  tableId: 1,
  orderStatus: 1,
});

OrderSchema.index({
  hotelId: 1,
  branchId: 1,
  paymentStatus: 1,
});

const OrderModel = mongoose.model("Order", OrderSchema);

export default OrderModel;


["ai" , "networking" , "edbms" , "python"]