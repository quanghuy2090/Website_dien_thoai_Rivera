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
    const product = await Product.findById(productObjectId).populate(
      "variants"
    );
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
        salePrice:
          variant.salePrice || variant.price * (1 - variant.sale / 100),
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
        message:
          "Số lượng không được phép bằng 0. Vui lòng xóa sản phẩm nếu cần.",
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
      (item) =>
        item.productId.equals(productId) && item.variantId.equals(variantId)
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
      (item) =>
        item.productId.equals(productId) && item.variantId.equals(variantId)
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

    // Bước 1: Tìm giỏ hàng của user và populate cơ bản
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name images short_description status variants",
      populate: [
        { path: "variants.color", select: "name" },
        { path: "variants.capacity", select: "value" },
      ],
    });

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    if (cart.items.length === 0) {
      return res.status(200).json({
        message: "Giỏ hàng hiện đang trống",
        cart: {
          userId: cart.userId,
          items: [],
          totalPrice: 0,
          totalSalePrice: 0,
          updateMessages: [],
        },
      });
    }

    // Bước 2: Xử lý thông tin chi tiết của từng item trong giỏ hàng
    const cartItems = cart.items.map((item) => {
      const product = item.productId; // Đã được populate từ bước 1

      // Tìm variant tương ứng với variantId trong mảng variants của product
      const variant = product?.variants.find((v) =>
        v._id.equals(item.variantId)
      );

      // Nếu không tìm thấy variant hoặc product, trả về thông tin cơ bản với giá trị mặc định
      if (!product || !variant) {
        return {
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          salePrice: item.salePrice,
          color: "N/A",
          capacity: "N/A",
          stock: 0,
          sku: "N/A",
          productName: "Sản phẩm không tồn tại",
          productImage: null,
          shortDescription: null,
          status: "unknown",
          isUpdated: true,
          updateMessage: "Sản phẩm không còn tồn tại trong hệ thống",
          isRemoved: item.isRemoved || false,
          removalReason: item.removalReason || null,
        };
      }

      // Kiểm tra xem sản phẩm có bị cập nhật không
      const isUpdated =
        item.price !== variant.price ||
        item.salePrice !==
          (variant.salePrice || variant.price * (1 - variant.sale / 100)) ||
        item.quantity > variant.stock;

      let updateMessage = null;
      if (isUpdated) {
        if (item.quantity > variant.stock) {
          updateMessage = `Số lượng sản phẩm đã được điều chỉnh từ ${item.quantity} xuống ${variant.stock} do tồn kho không đủ`;
        } else if (
          item.price !== variant.price ||
          item.salePrice !==
            (variant.salePrice || variant.price * (1 - variant.sale / 100))
        ) {
          updateMessage = "Giá sản phẩm đã thay đổi";
        }
      }

      return {
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity > variant.stock ? variant.stock : item.quantity,
        price: variant.price,
        salePrice:
          variant.salePrice || variant.price * (1 - variant.sale / 100),
        color: variant.color?.name || "N/A", // Lấy tên màu sắc
        capacity: variant.capacity?.value || "N/A", // Lấy giá trị dung lượng
        stock: variant.stock,
        sku: variant.sku,
        productName: product.name,
        productImage: product.images?.[0], // Lấy ảnh đầu tiên
        shortDescription: product.short_description,
        status: product.status,
        isUpdated: isUpdated,
        updateMessage: updateMessage,
        isRemoved: item.isRemoved || false,
        removalReason: item.removalReason || null,
      };
    });

    // Cập nhật giỏ hàng nếu có thay đổi
    let hasChanges = false;
    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];
      const updatedItem = cartItems[i];

      if (updatedItem.isUpdated) {
        hasChanges = true;
        // Cập nhật thông tin trong giỏ hàng
        cart.items[i].price = updatedItem.price;
        cart.items[i].salePrice = updatedItem.salePrice;
        cart.items[i].quantity = updatedItem.quantity;
      }
    }

    // Lưu giỏ hàng nếu có thay đổi
    if (hasChanges) {
      await cart.save();
    }

    return res.status(200).json({
      message: "Lấy thông tin giỏ hàng thành công",
      cart: {
        userId: cart.userId,
        items: cartItems,
        totalPrice: cart.totalPrice,
        totalSalePrice: cart.totalSalePrice,
        hasChanges: hasChanges,
        updateMessages: cart.updateMessages || [],
      },
    });
  } catch (error) {
    return res.status(500).json({ name: error.name, message: error.message });
  }
};

// Hàm cập nhật giỏ hàng khi sản phẩm thay đổi
export const updateCartsWithProductChanges = async (updatedProduct) => {
  try {
    console.log(
      `Đang cập nhật giỏ hàng cho sản phẩm: ${updatedProduct.name} (ID: ${updatedProduct._id})`
    );
    console.log(`Trạng thái sản phẩm: ${updatedProduct.status}`);
    console.log(`Số lượng biến thể: ${updatedProduct.variants.length}`);

    // Tìm tất cả giỏ hàng có chứa sản phẩm này
    const carts = await Cart.find({
      "items.productId": updatedProduct._id,
    });

    console.log(`Tìm thấy ${carts.length} giỏ hàng chứa sản phẩm này`);

    // Cập nhật từng giỏ hàng
    for (const cart of carts) {
      let cartUpdated = false;
      let updateMessages = [];
      let itemsToRemove = [];

      // Duyệt qua từng item trong giỏ hàng
      for (let i = 0; i < cart.items.length; i++) {
        const item = cart.items[i];

        // Kiểm tra nếu item là sản phẩm vừa cập nhật
        if (item.productId.equals(updatedProduct._id)) {
          console.log(
            `Đang cập nhật item trong giỏ hàng của user: ${cart.userId}`
          );

          // Tìm variant tương ứng trong sản phẩm đã cập nhật
          const updatedVariant = updatedProduct.variants.find((v) =>
            v._id.equals(item.variantId)
          );

          // Kiểm tra trạng thái sản phẩm
          if (updatedProduct.status === "banned") {
            console.log(`Sản phẩm đã bị cấm, xóa khỏi giỏ hàng`);
            // Nếu sản phẩm bị cấm, thêm vào danh sách cần xóa
            itemsToRemove.push(i);
            updateMessages.push(
              `Sản phẩm "${updatedProduct.name}" đã bị ngừng kinh doanh và đã được xóa khỏi giỏ hàng`
            );
            cartUpdated = true;
            continue;
          }

          if (updatedVariant) {
            console.log(`Tìm thấy biến thể tương ứng, cập nhật thông tin`);
            // Cập nhật thông tin sản phẩm trong giỏ hàng
            const oldPrice = cart.items[i].price;
            const oldSalePrice = cart.items[i].salePrice;
            const newPrice = updatedVariant.price;
            const newSalePrice =
              updatedVariant.salePrice ||
              updatedVariant.price * (1 - updatedVariant.sale / 100);

            cart.items[i].price = newPrice;
            cart.items[i].salePrice = newSalePrice;

            // Kiểm tra nếu số lượng trong giỏ hàng vượt quá số lượng tồn kho mới
            if (cart.items[i].quantity > updatedVariant.stock) {
              const oldQuantity = cart.items[i].quantity;
              cart.items[i].quantity = updatedVariant.stock;
              updateMessages.push(
                `Số lượng sản phẩm "${updatedProduct.name}" đã được điều chỉnh từ ${oldQuantity} xuống ${updatedVariant.stock} do tồn kho không đủ`
              );
            }

            // Kiểm tra nếu giá thay đổi
            if (oldPrice !== newPrice || oldSalePrice !== newSalePrice) {
              updateMessages.push(
                `Giá sản phẩm "${updatedProduct.name}" đã thay đổi`
              );
            }

            cartUpdated = true;
          } else {
            console.log(
              `Không tìm thấy biến thể tương ứng, cập nhật với biến thể mới`
            );
            // Nếu variant không còn tồn tại, thay vì xóa, chúng ta sẽ cập nhật với biến thể đầu tiên
            // hoặc giữ nguyên thông tin cũ nhưng đánh dấu là không còn tồn tại
            if (updatedProduct.variants.length > 0) {
              // Nếu có biến thể mới, sử dụng biến thể đầu tiên
              const firstVariant = updatedProduct.variants[0];
              const oldVariantId = cart.items[i].variantId;

              cart.items[i].variantId = firstVariant._id;
              cart.items[i].price = firstVariant.price;
              cart.items[i].salePrice =
                firstVariant.salePrice ||
                firstVariant.price * (1 - firstVariant.sale / 100);

              // Kiểm tra số lượng
              if (cart.items[i].quantity > firstVariant.stock) {
                const oldQuantity = cart.items[i].quantity;
                cart.items[i].quantity = firstVariant.stock;
                updateMessages.push(
                  `Số lượng sản phẩm "${updatedProduct.name}" đã được điều chỉnh từ ${oldQuantity} xuống ${firstVariant.stock} do tồn kho không đủ`
                );
              }

              updateMessages.push(
                `Biến thể sản phẩm "${updatedProduct.name}" đã thay đổi`
              );
            } else {
              // Nếu không còn biến thể nào, thêm vào danh sách cần xóa
              itemsToRemove.push(i);
              updateMessages.push(
                `Biến thể sản phẩm "${updatedProduct.name}" không còn tồn tại và đã được xóa khỏi giỏ hàng`
              );
            }

            cartUpdated = true;
          }
        }
      }

      // Xóa các item đã đánh dấu
      if (itemsToRemove.length > 0) {
        // Sắp xếp mảng index giảm dần để tránh lỗi khi xóa nhiều phần tử
        itemsToRemove.sort((a, b) => b - a);

        // Xóa từng item theo index
        for (const index of itemsToRemove) {
          cart.items.splice(index, 1);
        }

        console.log(`Đã xóa ${itemsToRemove.length} sản phẩm khỏi giỏ hàng`);
      }

      // Nếu giỏ hàng đã được cập nhật, lưu lại
      if (cartUpdated) {
        console.log(
          `Lưu giỏ hàng với ${updateMessages.length} thông báo cập nhật`
        );
        // Lưu thông báo cập nhật vào giỏ hàng
        cart.updateMessages = updateMessages;
        await cart.save();
      }
    }

    console.log(
      `Đã cập nhật ${carts.length} giỏ hàng cho sản phẩm ${updatedProduct.name}`
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
  }
};
