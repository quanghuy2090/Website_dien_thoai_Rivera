import Cart from "../models/Cart.js";

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Nếu giỏ hàng đã tồn tại, cập nhật sản phẩm
      const itemIndex = cart.items.findIndex(
        (item) => item.productId == productId
      );

      if (itemIndex > -1) {
        // Sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Sản phẩm chưa tồn tại trong giỏ hàng, thêm mới
        cart.items.push({ productId, quantity });
      }
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      // Nếu giỏ hàng chưa tồn tại, tạo mới
      const newCart = await Cart.create({
        userId,
        items: [{ productId, quantity }],
      });
      return res.status(201).send(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Lấy giỏ hàng của người dùng
export const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).send("Cart not found");
    }
    res.status(200).send(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    cart.items = cart.items.filter((item) => item.productId != productId);
    await cart.save();
    res.status(200).send(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
