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
  sale: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    required: true,
  },
  salePrice: {
    type: Number,
    min: 0,
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
    // match: [/^[A-Z]{3}-[A-Z]{3}-[0-9]+-[0-9]{4}$/, "SKU phải có định dạng hợp lệ"],
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
// Tính salePrice cho tất cả variants và làm tròn 2 chữ số
productSchema.pre('save', function(next) {
  this.variants.forEach(variant => {
    if (variant.isModified('price') || variant.isModified('sale')) {
      const calculatedSalePrice = variant.price * (1 - variant.sale / 100);
      variant.salePrice = Number(calculatedSalePrice.toFixed(2)); // Làm tròn 2 số sau dấu phẩy
      if (variant.salePrice < 0) variant.salePrice = 0; // Đảm bảo không âm
    }
  });
  next();
});

productSchema.index({ name: "text" });
productSchema.index({ categoryId: 1 });

export default mongoose.model("Product", productSchema);
