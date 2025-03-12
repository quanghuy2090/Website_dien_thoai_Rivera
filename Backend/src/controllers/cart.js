import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { validateCart, validateCartItem } from "../validation/cart.js";

// Thêm hoặc cập nhật giỏ hàng
export const createCart = async (req, res) => {
  const { items } = req.body;
  const user = req.user; // Lấy thông tin user từ middleware checkUserPermission

  // Kiểm tra dữ liệu đầu vào cơ bản
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ message: "Danh sách items không hợp lệ hoặc rỗng." });
  }

  try {
    // Chuẩn bị dữ liệu để validate
    const cartData = {
      userId: user._id, // Sử dụng user._id từ middleware thay vì req.body.userId
      items,
    };

    // Kiểm tra dữ liệu đầu vào với validateCart
    await validateCart(cartData);

    // Tìm giỏ hàng hiện có của user
    let cart = await Cart.findOne({ userId: user._id });

    if (cart) {
      // Nếu giỏ hàng đã tồn tại, cập nhật sản phẩm
      for (const newItem of items) {
        const { productId, variantId, quantity } = newItem;

        // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
        const itemIndex = cart.items.findIndex(
          (item) =>
            item.productId.equals(productId) && item.variantId.equals(variantId)
        );

        if (itemIndex > -1) {
          // Nếu sản phẩm đã tồn tại, cập nhật số lượng
          cart.items[itemIndex].quantity += quantity;
        } else {
          // Nếu sản phẩm chưa tồn tại, thêm mới
          cart.items.push({ productId, variantId, quantity });
        }
      }
    } else {
      // Nếu giỏ hàng chưa tồn tại, tạo mới
      cart = new Cart({
        userId: user._id,
        items,
      });
    }

    // Lưu giỏ hàng (tạo mới hoặc cập nhật)
    const savedCart = await cart.save();

    // Tính tổng tiền
    let totalPrice = 0;
    for (const item of savedCart.items) {
      const product = await Product.findOne({
        _id: item.productId,
        "variants._id": item.variantId,
      });
      const variant = product.variants.id(item.variantId);
      totalPrice += variant.price * item.quantity;
    }

    // Trả về kết quả
    return res.status(201).json({
      message: cart.isNew
        ? "Giỏ hàng được tạo thành công"
        : "Giỏ hàng được cập nhật thành công",
      cart: savedCart,
      totalPrice,
    });
  } catch (error) {
    console.error("Lỗi khi xử lý giỏ hàng:", error);
    return res.status(400).json({
      message: error.message || "Có lỗi xảy ra khi xử lý giỏ hàng.",
    });
  }
};

// Lấy thông tin giỏ hàng
export const getCart = async (req, res) => {
  const user = req.user;

  try {
    // Tìm giỏ hàng của user hiện tại
    const cart = await Cart.findOne({ userId: user._id })
      .populate({
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

// Xóa sản phẩm khỏi giỏ hàng
// export const removeFromCart = async (req, res) => {
//   const { userId, productId } = req.params;

//   try {
//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     // Lọc ra các sản phẩm không phải là sản phẩm cần xóa
//     cart.items = cart.items.filter((item) => item.productId != productId);
//     await cart.save();

//     // Trả về giỏ hàng đã cập nhật
//     res.status(200).json(cart);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Cập nhật sản phẩm trong giỏ hàng
// export const updateCart = async (req, res) => {
//   const { userId } = req.params;
//   const { productId, quantity } = req.body;

//   try {
//     // Kiểm tra xem giỏ hàng có tồn tại không
//     let cart = await Cart.findOne({ userId }).populate("items.productId");

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     // Kiểm tra sản phẩm có trong giỏ hàng hay không
//     const itemIndex = cart.items.findIndex(
//       (item) => item.productId._id == productId
//     );

//     if (itemIndex > -1) {
//       // Nếu tìm thấy sản phẩm, cập nhật số lượng
//       if (quantity <= 0) {
//         // Nếu số lượng <= 0 thì xóa sản phẩm
//         cart.items.splice(itemIndex, 1);
//       } else {
//         cart.items[itemIndex].quantity = quantity;
//       }
//     } else {
//       return res.status(404).json({ message: "Product not found in cart" });
//     }

//     // Lưu lại giỏ hàng sau khi cập nhật
//     cart = await cart.save();

//     // Tính lại tổng tiền
//     const totalAmount = cart.items.reduce((total, item) => {
//       return total + item.productId.price * item.quantity;
//     }, 0);

//     // Trả về giỏ hàng đã cập nhật và tổng tiền
//     return res.status(200).json({
//       message: "Cart updated successfully",
//       cart,
//       totalAmount,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
