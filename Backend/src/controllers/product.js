import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { productValidation } from "../validation/product.js";
import Color from "../models/Color.js";
import Capacity from "../models/Capacity.js";

export const getAllProduct = async (req, res) => {
  try {
    // Lấy tất cả sản phẩm và populate categoryId
    const products = await Product.find().populate("categoryId");

    // Kiểm tra nếu không có sản phẩm
    if (!products || products.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm nào",
      });
    }

    // Trả về danh sách sản phẩm
    return res.status(200).json({
      message: "Lấy danh sách sản phẩm thành công",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Đã xảy ra lỗi khi lấy danh sách sản phẩm",
    });
  }
};

export const getDetailProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId"
    );
    if (!product) {
      return res.status(404).json({
        message: "Khong co san pham",
      });
    }
    // Tìm sản phẩm liên quan, chỉ lấy các trường cần thiết
    const relatedProducts = await Product.find({
      categoryId: product.categoryId,
      _id: { $ne: product._id },
      status: "active",
    }).limit(5);
    return res.status(200).json({
      message: "Lay chi tiet san pham thanh cong!",
      data: product,
      relatedProducts,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

// Hàm tạo SKU tự động
const generateSKU = async (productName, colorId, capacityId) => {
  // Lấy thông tin color và capacity từ _id
  const color = await Color.findById(colorId);
  const capacity = await Capacity.findById(capacityId);

  // Tạo prefix từ tên sản phẩm (lấy 3 ký tự đầu, uppercase)
  const namePrefix = productName.slice(0, 3).toUpperCase();

  // Tạo mã từ color và capacity (uppercase, lấy ngắn gọn)
  const colorCode = color.name.slice(0, 3).toUpperCase();
  const capacityCode = capacity.value.replace(/[^0-9]/g, ""); // Chỉ lấy số (64GB -> 64)

  // Thêm timestamp hoặc random string để đảm bảo độc nhất
  const uniqueCode = Date.now().toString().slice(-4); // Lấy 4 số cuối của timestamp

  // Kết hợp thành SKU
  return `${namePrefix}-${colorCode}-${capacityCode}-${uniqueCode}`;
};

export const createProduct = async (req, res) => {
  try {
    // Validate dữ liệu từ req.body bằng productValidation
    const { error } = productValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    // Kiểm tra xem tên sản phẩm đã tồn tại chưa
    const existingProduct = await Product.findOne({ name: req.body.name });
    if (existingProduct) {
      return res.status(400).json({
        message: `Sản phẩm "${req.body.name}" đã tồn tại`,
      });
    }

    // Kiểm tra danh mục có tồn tại không
    const category = await Category.findById(req.body.categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }

    // Kiểm tra tính hợp lệ của color và capacity trong variants + sinh SKU
    const variantErrors = [];
    for (const variant of req.body.variants) {
      // Kiểm tra color
      const color = await Color.findById(variant.color);
      if (!color) {
        variantErrors.push(`Color không tồn tại`);
      }

      // Kiểm tra capacity
      const capacity = await Capacity.findById(variant.capacity);
      if (!capacity) {
        variantErrors.push(`Capacity không tồn tại`);
      }

      // Nếu không có lỗi, sinh SKU tự động
      if (color && capacity) {
        variant.sku = await generateSKU(req.body.name, variant.color, variant.capacity);
      }
    }

    if (variantErrors.length > 0) {
      return res.status(400).json({
        message: variantErrors.join(", "),
      });
    }

    // Tạo sản phẩm mới
    const product = new Product(req.body);
    const savedProduct = await product.save();
    if (!savedProduct) {
      return res.status(500).json({
        message: "Tạo sản phẩm mới không thành công",
      });
    }

    // Cập nhật sản phẩm vào danh mục
    const updatedCategory = await Category.findByIdAndUpdate(
      req.body.categoryId,
      {
        $addToSet: { products: savedProduct._id },
      },
      { new: true }
    );

    // Nếu cập nhật danh mục thất bại
    if (!updatedCategory) {
      await Product.findByIdAndDelete(savedProduct._id);
      return res.status(500).json({
        message: "Không thể cập nhật danh mục, sản phẩm đã bị hủy",
      });
    }

    return res.status(201).json({
      message: "Tạo sản phẩm mới thành công",
      data: savedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Đã xảy ra lỗi khi tạo sản phẩm",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID sản phẩm từ params
    const updateData = req.body;

    // Validate dữ liệu đầu vào (sử dụng validation giống createProduct)
    const { error } = productValidation.validate(updateData, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }

    // Nếu cập nhật name, kiểm tra trùng lặp (trừ sản phẩm hiện tại)
    if (updateData.name && updateData.name !== product.name) {
      const existingProduct = await Product.findOne({ name: updateData.name });
      if (existingProduct) {
        return res.status(400).json({
          message: `Sản phẩm "${updateData.name}" đã tồn tại`,
        });
      }
    }

    // Nếu cập nhật categoryId, kiểm tra và cập nhật danh mục
    if (
      updateData.categoryId &&
      updateData.categoryId !== product.categoryId.toString()
    ) {
      const category = await Category.findById(updateData.categoryId);
      if (!category) {
        return res.status(404).json({
          message: "Danh mục không tồn tại",
        });
      }

      // Xóa sản phẩm khỏi danh mục cũ và thêm vào danh mục mới
      await Category.findByIdAndUpdate(product.categoryId, {
        $pull: { products: product._id },
      });
      await Category.findByIdAndUpdate(updateData.categoryId, {
        $addToSet: { products: product._id },
      });
    }

    // Nếu cập nhật variants, kiểm tra color, capacity và SKU
    if (updateData.variants) {
      const variantErrors = [];
      for (const variant of updateData.variants) {
        // Kiểm tra color nếu có
        if (variant.color) {
          const color = await Color.findById(variant.color);
          if (!color) {
            variantErrors.push(`Color "${variant.color}" không tồn tại`);
          }
        }

        // Kiểm tra capacity nếu có
        if (variant.capacity) {
          const capacity = await Capacity.findById(variant.capacity);
          if (!capacity) {
            variantErrors.push(`Capacity "${variant.capacity}" không tồn tại`);
          }
        }

        // Kiểm tra SKU duy nhất (trừ sản phẩm hiện tại)
        if (variant.sku) {
          const existingVariant = await Product.findOne({
            "variants.sku": variant.sku,
            _id: { $ne: id }, // Loại trừ sản phẩm hiện tại
          });
          if (existingVariant) {
            variantErrors.push(`SKU "${variant.sku}" đã tồn tại`);
          }
        }

        // Nếu không có SKU, sinh tự động (tùy theo logic của bạn)
        if (!variant.sku && variant.color && variant.capacity) {
          variant.sku = await generateSKU(
            updateData.name || product.name,
            variant.color,
            variant.capacity
          );
        }
      }

      if (variantErrors.length > 0) {
        return res.status(400).json({
          message: variantErrors.join(", "),
        });
      }
    }

    // Cập nhật sản phẩm
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(500).json({
        message: "Cập nhật sản phẩm không thành công",
      });
    }

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Đã xảy ra lỗi khi cập nhật sản phẩm",
    });
  }
};

export const removeProduct = async (req, res) => {
  try {
    // Tìm sản phẩm trước khi xóa
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }

    // Xóa sản phẩm khỏi danh mục (nếu có categoryId)
    if (product.categoryId) {
      const category = await Category.findByIdAndUpdate(
        product.categoryId,
        {
          $pull: { products: product._id }, // Xóa product._id khỏi mảng products
        },
        { new: true }
      );
      if (!category) {
        return res.status(404).json({
          message: "Không tìm thấy danh mục liên quan để cập nhật",
        });
      }
    }

    // Xóa sản phẩm
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Xóa sản phẩm không thành công",
      });
    }

    return res.status(200).json({
      message: "Xóa sản phẩm thành công",
      data: deletedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// API tim kiem san pham theo name
export const searchProductByName = async (req, res) => {
  try {
    const { name } = req.body; //nhap tu khoa va kiem tra da nhap chua
    if (!name) {
      return res.status(400).json({
        message: "Ban can phai nhap ten san pham can tim",
      });
    }
    //tim kiem name
    const products = await Product.find({ $text: { $search: name } }).populate(
      "categoryId"
    );
    //neu khong co san pham ton tai
    if (products.length === 0) {
      return res.status(404).json({
        message: "Khong tim thay san pham",
      });
    }

    //tim thay thi in ra
    res.status(200).json({
      message: "tim thay san pham",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Da say ra loi khi tim kiem san pham",
      error: error.message,
    });
  }
};
