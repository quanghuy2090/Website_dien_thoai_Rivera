import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true, // Màu sắc là bắt buộc trong biến thể
    enum: ["Red", "Blue","Black","White","Green"]
  },
  capacity: {
    type: String, // Dung lượng (có thể để trống nếu không áp dụng)
    required: true,
    enum: ["64GB","128GB","256GB","512GB","1TB"]
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
    unique: true, // Mã SKU duy nhất cho từng biến thể
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
      type: String, //Mô tả ngắn
    },
    long_description: {
      type: String, //Mô tả dài
    },
    status: {
      type: String,
      enum: ["active", "banned"], //Trạng thái
      default: "active",
    },
    is_hot: {
      type: String,
      enum: ["yes", "no"], //SP Hót
      default: "no",
    },
    variants: {
      type: [variantSchema], // Thêm schema biến thể
      required: true, //Sản phẩm phải có ít nhất 1 biến thể
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

//Text index để tìm kiếm theo name
productSchema.index({ name: "text" });

productSchema.index({ categoryId: 1 });

export default mongoose.model("Product", productSchema);
