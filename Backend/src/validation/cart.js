import mongoose from "mongoose";
import User from "../models/User.js";
const Product = mongoose.model("Product");

// Hàm kiểm tra hợp lệ một mục trong giỏ hàng
async function validateCartItem(productId, variantId, quantity) {
  const product = await Product.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    throw new Error("Sản phẩm hoặc biến thể không tồn tại.");
  }

  const variant = product.variants.id(variantId);
  if (!variant) {
    throw new Error("Không tìm thấy biến thể trong sản phẩm.");
  }

  if (quantity <= 0) {
    throw new Error("Số lượng phải lớn hơn 0.");
  }

  if (quantity > variant.stock) {
    throw new Error(`Số lượng vượt quá tồn kho hiện có (${variant.stock}).`);
  }

  return { product, variant };
}

// Hàm kiểm tra hợp lệ toàn bộ giỏ hàng
async function validateCart(cartData) {
  const { userId, items } = cartData;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("ID người dùng không hợp lệ.");
  }

  // Kiểm tra userId có tồn tại trong collection User không
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Người dùng không tồn tại.");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Danh sách mục trong giỏ hàng phải là mảng không rỗng.");
  }

  for (const item of items) {
    await validateCartItem(item.productId, item.variantId, item.quantity);
  }
}

export { validateCartItem, validateCart };