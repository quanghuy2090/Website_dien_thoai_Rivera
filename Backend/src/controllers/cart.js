import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const createCart = async (req, res) => {
  try {
    const { userId, items } = req.body;

    // Kiểm tra userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId là bắt buộc",
      });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "userId không tồn tại",
      });
    }

    // Kiểm tra items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items phải là một mảng không rỗng",
      });
    }

    // Kiểm tra từng item
    for (const item of items) {
      // Kiểm tra xem các trường có được định nghĩa không
      if (
        item.productId === undefined ||
        item.variantId === undefined ||
        item.quantity === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "Mỗi item phải có productId, variantId và quantity",
        });
      }

      // Kiểm tra quantity là số và lớn hơn hoặc bằng 1
      if (typeof item.quantity !== "number" || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity phải là số lớn hơn hoặc bằng 1",
        });
      }

      // Kiểm tra productId có tồn tại không
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm không tồn tại`,
        });
      }

      // Kiểm tra variantId có tồn tại trong variants của product không
      const variant = product.variants.find(
        (v) => v._id.toString() === item.variantId.toString()
      );
      if (!variant) {
        return res.status(400).json({
          success: false,
          message: "Biến thể không tồn tại trong sản phẩm!",
        });
      }

      // Kiểm tra stock của variant
      if (variant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Số lượng yêu cầu (${item.quantity}) vượt quá số lượng tồn kho (${variant.stock})!`,
        });
      }
    }

    // Kiểm tra xem user đã có cart chưa
    let cart = await Cart.findOne({ userId });
    if (cart) {
      // Nếu giỏ hàng đã tồn tại, cập nhật hoặc thêm item
      for (const newItem of items) {
        const existingItemIndex = cart.items.findIndex(
          (item) =>
            item.productId.toString() === newItem.productId.toString() &&
            item.variantId.toString() === newItem.variantId.toString()
        );

        if (existingItemIndex > -1) {
          // Nếu sản phẩm và variant đã tồn tại, cộng dồn số lượng
          const updatedQuantity =
            cart.items[existingItemIndex].quantity + newItem.quantity;

          // Kiểm tra lại stock sau khi cộng dồn
          const product = await Product.findById(newItem.productId);
          const variant = product.variants.find(
            (v) => v._id.toString() === newItem.variantId.toString()
          );
          if (variant.stock < updatedQuantity) {
            return res.status(400).json({
              success: false,
              message: `Số lượng yêu cầu (${updatedQuantity}) vượt quá số lượng tồn kho (${variant.stock}) cho variant ${newItem.variantId}`,
            });
          }

          cart.items[existingItemIndex].quantity = updatedQuantity;
        } else {
          // Nếu chưa tồn tại, thêm item mới vào giỏ hàng
          cart.items.push(newItem);
        }
      }

      // Lưu cập nhật giỏ hàng
      const updatedCart = await cart.save();
      return res.status(200).json({
        success: true,
        message: "Giỏ hàng đã được cập nhật",
        data: updatedCart,
      });
    } else {
      // Nếu chưa có giỏ hàng, tạo mới
      const newCart = new Cart({
        userId,
        items,
      });

      const savedCart = await newCart.save();
      return res.status(201).json({
        success: true,
        message: "Tạo giỏ hàng thành công",
        data: savedCart,
      });
    }
  } catch (error) {
    console.error("Lỗi khi tạo giỏ hàng:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo giỏ hàng",
      error: error.message,
    });
  }
};

// Lấy thông tin giỏ hàng
export const getCart = async (req, res) => {
  const user = req.user;

  try {
    // Tìm giỏ hàng của user hiện tại
    const cart = await Cart.findOne({ userId: user._id }).populate({
      path: "items.productId",
      select: "name price variants", // Lấy các trường cần thiết
    });

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
    }

    // Tính tổng tiền dựa trên variants
    let totalAmount = 0;
    for (const item of cart.items) {
      const product = item.productId;
      const variant = product.variants.id(item.variantId); // Lấy variant từ product
      if (!variant) {
        return res.status(500).json({
          message: `Không tìm thấy biến thể ${item.variantId} trong sản phẩm ${item.productId}.`,
        });
      }
      totalAmount += variant.price * item.quantity; // Tính giá dựa trên variant.price
    }

    // Trả về giỏ hàng và tổng tiền
    return res.status(200).json({
      message: "Danh sách sản phẩm trong giỏ hàng!",
      cart,
      totalAmount,
    });
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    return res.status(500).json({
      message: "Có lỗi xảy ra khi lấy thông tin giỏ hàng.",
      error: error.message,
    });
  }
};


