import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true, // Màu sắc là bắt buộc trong biến thể
  },
  capacity: {
    type: String, // Dung lượng (có thể để trống nếu không áp dụng)
  },
  price: {
    type: Number,
    required: true,
    min: 1, // Giá tối thiểu là 1
  },
  stock: {
    type: Number,
    required: true,
    min: 0, // Số lượng tồn kho tối thiểu là 0
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
      required: true, // Sửa "require" thành "required"
      minLength: 3,
    },
    images: {
      type: [String],
      required: true, // Giữ nguyên mảng ảnh
    },
    short_description: {
      type: String, // Thêm mô tả ngắn
    },
    long_description: {
      type: String, // Thay "description" thành "long_description"
    },
    status: {
      type: String,
      enum: ["active", "banned"], // Giữ nguyên trạng thái
      default: "active",
    },
    is_hot: {
      type: String,
      enum: ["yes", "no"], // Giữ nguyên
      default: "no",
    },
    variants: {
      type: [variantSchema], // Thêm schema biến thể
      required: true, // Đảm bảo sản phẩm phải có ít nhất 1 biến thể
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true, // Sửa "require" thành "required"
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
    versionKey: false, // Loại bỏ __v
  }
);

// Thêm text index để tìm kiếm theo name
productSchema.index({ name: "text" });

export default mongoose.model("Product", productSchema);