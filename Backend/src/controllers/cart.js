import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (cart) {
      // Nếu giỏ hàng đã tồn tại, cập nhật sản phẩm
      const itemIndex = cart.items.findIndex(
        (item) => item.productId._id == productId
      );

      if (itemIndex > -1) {
        // Sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Sản phẩm chưa tồn tại trong giỏ hàng, thêm mới
        const product = await Product.findById(productId);
        cart.items.push({ productId: product, quantity });
      }
      cart = await cart.save();
    } else {
      // Nếu giỏ hàng chưa tồn tại, tạo mới
      const product = await Product.findById(productId);
      cart = await Cart.create({
        userId,
        items: [{ productId: product, quantity }],
      });
    }

    // Tính tổng tiền
    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    // Trả về giỏ hàng và tổng tiền
    res.status(201).json({
      cart,
      totalAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy thông tin giỏ hàng
export const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Tính tổng tiền
    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    // Trả về giỏ hàng và tổng tiền
    return res.status(200).json({
      cart,
      totalAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Lọc ra các sản phẩm không phải là sản phẩm cần xóa
    cart.items = cart.items.filter((item) => item.productId != productId);
    await cart.save();

    // Trả về giỏ hàng đã cập nhật
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cập nhật sản phẩm trong giỏ hàng
export const updateCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  try {
    // Kiểm tra xem giỏ hàng có tồn tại không
    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Kiểm tra sản phẩm có trong giỏ hàng hay không
    const itemIndex = cart.items.findIndex((item) => item.productId._id == productId);

    if (itemIndex > -1) {
      // Nếu tìm thấy sản phẩm, cập nhật số lượng
      if (quantity <= 0) {
        // Nếu số lượng <= 0 thì xóa sản phẩm
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Lưu lại giỏ hàng sau khi cập nhật
    cart = await cart.save();

    // Tính lại tổng tiền
    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    // Trả về giỏ hàng đã cập nhật và tổng tiền
    return res.status(200).json({
      message: "Cart updated successfully",
      cart,
      totalAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

