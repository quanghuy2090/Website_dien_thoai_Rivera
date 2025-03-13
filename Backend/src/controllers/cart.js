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

export const getCart = async (req, res) => {
  try {
    // Lấy userId từ req.user (được gán bởi middleware checkUserPermission)
    const userId = req.user._id;

    // Tìm giỏ hàng của user và populate thông tin cần thiết
    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId",
        select: "name images short_description status variants",
      })
      .lean();

    if (!cart) {
      return res.status(200).json({
        message: "Giỏ hàng trống",
        data: {
          userId,
          items: [],
        },
      });
    }

    // Xử lý dữ liệu trả về để bao gồm thông tin biến thể cụ thể
    const cartItems = cart.items.map((item) => {
      const product = item.productId;
      
      // Tìm variant tương ứng trong mảng variants của product
      const variant = product.variants.find(
        (v) => v._id.toString() === item.variantId.toString()
      );

      if (!variant) {
        return null; // Nếu không tìm thấy variant (trường hợp lỗi dữ liệu)
      }

      return {
        productId: product._id,
        name: product.name,
        image: product.images[0], // Lấy ảnh đầu tiên
        variant: {
          color: variant.color,
          capacity: variant.capacity,
          price: variant.price,
          stock: variant.stock,
          sku: variant.sku,
        },
        quantity: item.quantity,
        subtotal: variant.price * item.quantity,
      };
    }).filter(item => item !== null); // Lọc bỏ các item null (nếu có)

    // Tính tổng tiền giỏ hàng
    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    return res.status(200).json({
      message: "Lấy giỏ hàng thành công",
      data: {
        userId,
        items: cartItems,
        total,
      },
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};