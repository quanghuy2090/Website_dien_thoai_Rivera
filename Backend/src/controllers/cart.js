import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

export const createCart = async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    const userId = req.user._id;

    // Giới hạn số lượng tối đa
    const MAX_QUANTITY = 100;
    if (quantity > MAX_QUANTITY) {
      return res.status(400).json({
        message: `Số lượng tối đa cho phép là ${MAX_QUANTITY}`,
      });
    }

    // Chuyển đổi productId và variantId thành ObjectId để so sánh chính xác
    const productObjectId = new mongoose.Types.ObjectId(productId);
    const variantObjectId = new mongoose.Types.ObjectId(variantId);

    // Bước 1: Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(productObjectId).populate("variants");
    console.log('Found product:', product);  // Log sản phẩm
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }


    // Bước 2: Kiểm tra trạng thái sản phẩm
    if (product.status === "banned") {
      return res.status(400).json({
        message: "Sản phẩm đã ngừng kinh doanh",
      });
    }

    // Bước 3: Kiểm tra biến thể sản phẩm
    const variant = product.variants.find((v) => v._id.equals(variantObjectId));
    if (!variant) {
      return res.status(404).json({
        message: "Biến thể sản phẩm không tồn tại",
      });
    }

    // Bước 4: Kiểm tra số lượng tồn kho
    if (variant.stock < quantity) {
      return res.status(400).json({
        message: `Số lượng tồn kho không đủ. Còn lại: ${variant.stock}`,
      });
    }

    // Bước 5: Tìm giỏ hàng của user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Bước 6: Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.equals(productObjectId) &&
        item.variantId.equals(variantObjectId)
    );

    if (existingItemIndex > -1) {
      // Sản phẩm đã có trong giỏ
      const existingItem = cart.items[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > variant.stock) {
        return res.status(400).json({
          message: `Số lượng tồn kho không đủ. Còn lại: ${variant.stock}`,
        });
      }

      if (newQuantity > MAX_QUANTITY) {
        return res.status(400).json({
          message: `Số lượng tối đa cho phép là ${MAX_QUANTITY}`,
        });
      }

      // Cộng dồn số lượng
      existingItem.quantity = newQuantity;

      // Lưu giỏ hàng sau khi cập nhật
      await cart.save();

      return res.status(200).json({
        message: "Sản phẩm đã có trong giỏ, số lượng đã được cập nhật",
        cart,
      });
    } else {
      // Thêm sản phẩm mới vào giỏ
      const cartItem = {
        productId: productObjectId,
        variantId: variantObjectId,
        quantity,
        price: variant.price,
        salePrice: variant.salePrice || variant.price * (1 - variant.sale / 100),
        color: variant.color, // Giả sử populate từ ref "Color"
        capacity: variant.capacity, // Giả sử populate từ ref "Capacity"
      };

      cart.items.push(cartItem);
    }

    // Lưu giỏ hàng
    await cart.save();

    return res.status(201).json({
      message: "Thêm sản phẩm vào giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    const userId = req.user._id;

    // Giới hạn số lượng tối đa
    const MAX_QUANTITY = 100;
    if (quantity > MAX_QUANTITY) {
      return res.status(400).json({
        message: `Số lượng tối đa cho phép là ${MAX_QUANTITY}`,
      });
    }

    // Kiểm tra số lượng không được phép bằng 0
    if (quantity === 0) {
      return res.status(400).json({
        message: "Số lượng không được phép bằng 0. Vui lòng xóa sản phẩm nếu cần.",
      });
    }

    // Bước 1: Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(productId).populate("variants");
    if (!product) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }

    // Bước 2: Kiểm tra biến thể sản phẩm
    const variant = product.variants.find((v) => v._id.equals(variantId));
    if (!variant) {
      return res.status(404).json({
        message: "Biến thể sản phẩm không tồn tại",
      });
    }

    // Bước 3: Kiểm tra số lượng tồn kho
    if (quantity > variant.stock) {
      return res.status(400).json({
        message: `Số lượng tồn kho không đủ. Còn lại: ${variant.stock}`,
      });
    }

    // Bước 4: Tìm giỏ hàng của user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        message: "Giỏ hàng không tồn tại",
      });
    }

    // Bước 5: Kiểm tra sản phẩm có trong giỏ hàng không
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.equals(productId) && item.variantId.equals(variantId)
    );
    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Sản phẩm không có trong giỏ hàng",
      });
    }

    // Bước 6: Cập nhật số lượng mới
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = variant.price;
    cart.items[itemIndex].salePrice =
      variant.salePrice || variant.price * (1 - variant.sale / 100);

    // Lưu giỏ hàng
    await cart.save();

    return res.status(200).json({
      message: "Cập nhật giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const removeCart = async (req, res) => {
  try {
    const { productId, variantId } = req.body;
    const userId = req.user._id; // Lấy từ middleware checkUserPermission

    // Bước 1: Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(productId).populate("variants");
    if (!product) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }

    // Bước 2: Kiểm tra biến thể sản phẩm
    const variant = product.variants.find((v) => v._id.equals(variantId));
    if (!variant) {
      return res.status(404).json({
        message: "Biến thể sản phẩm không tồn tại",
      });
    }

    // Bước 3: Tìm giỏ hàng của user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        message: "Giỏ hàng không tồn tại",
      });
    }

    // Bước 4: Kiểm tra sản phẩm có trong giỏ hàng không
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.equals(productId) && item.variantId.equals(variantId)
    );
    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Sản phẩm không có trong giỏ hàng",
      });
    }

    // Bước 5: Xóa sản phẩm khỏi giỏ hàng
    cart.items.splice(itemIndex, 1);

    // Lưu giỏ hàng
    await cart.save();

    return res.status(200).json({
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const removeAllCart = async (req, res) => {
  try {
    const userId = req.user._id; // Lấy từ middleware checkUserPermission

    // Bước 1: Tìm giỏ hàng của user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        message: "Giỏ hàng không tồn tại",
      });
    }

    // Bước 2: Kiểm tra xem giỏ hàng có sản phẩm không
    if (cart.items.length === 0) {
      return res.status(400).json({
        message: "Giỏ hàng đã trống",
      });
    }

    // Bước 3: Xóa toàn bộ sản phẩm trong giỏ hàng
    cart.items = [];

    // Lưu giỏ hàng
    await cart.save();

    return res.status(200).json({
      message: "Đã xóa toàn bộ giỏ hàng",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const getAllCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Bước 1: Tìm giỏ hàng của user
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name images short_description status",
    });

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    if (cart.items.length === 0) {
      return res.status(200).json({
        message: "Giỏ hàng hiện đang trống",
        cart: { userId: cart.userId, items: [], totalPrice: 0, totalSalePrice: 0 },
      });
    }

    // Bước 2: Lấy thông tin chi tiết của từng sản phẩm và biến thể
    const cartItems = await Promise.all(
      cart.items.map(async (item) => {
        // 👉 Sửa lỗi populate tại đây: Gọi trên `Product.findById()`
        const product = await Product.findById(item.productId)
          .populate({
            path: "variants",
            match: { _id: item.variantId },
            populate: [
              { path: "color", select: "name" },  // Lấy tên màu sắc
              { path: "capacity", select: "value" }, // Lấy giá trị dung lượng
            ],
            select: "color capacity price sale salePrice stock sku",
          });

        const variant = product?.variants[0]; // Lấy variant khớp với variantId

        return {
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          salePrice: item.salePrice,
          color: variant?.color?.name || "N/A", // Tránh lỗi null
          capacity: variant?.capacity?.value || "N/A",
          stock: variant?.stock,
          sku: variant?.sku,
          productName: product?.name,
          productImage: product?.images?.[0], // Lấy ảnh đầu tiên
          shortDescription: product?.short_description,
          status: product?.status,
        };
      })
    );

    return res.status(200).json({
      message: "Lấy thông tin giỏ hàng thành công",
      cart: {
        userId: cart.userId,
        items: cartItems,
        totalPrice: cart.totalPrice,
        totalSalePrice: cart.totalSalePrice,
      },
    });
  } catch (error) {
    return res.status(500).json({ name: error.name, message: error.message });
  }
};
