import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color",
    required: true,
  },
  capacity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Capacity",
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  sku: {
    type: String,
    unique: true,
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    images: {
      type: [String],
      required: true,
    },
    short_description: {
      type: String,
    },
    long_description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },
    is_hot: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    variants: {
      type: [variantSchema],
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index({ name: "text" });
productSchema.index({ categoryId: 1 });

export default mongoose.model("Product", productSchema);