import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { productValidation } from "../validation/product.js";

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

    // Tạo sản phẩm mới
    const product = await Product.create(req.body);
    if (!product) {
      return res.status(404).json({
        message: "Tạo sản phẩm mới không thành công",
      });
    }

    // Cập nhật sản phẩm vào danh mục
    const updateCategory = await Category.findByIdAndUpdate(
      req.body.categoryId,
      {
        $addToSet: {
          products: product._id, // Thêm product._id vào mảng products của Category
        },
      },
      { new: true } // Trả về document sau khi cập nhật
    );

    if (!updateCategory) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục để cập nhật",
      });
    }

    return res.status(200).json({
      message: "Tạo sản phẩm mới thành công",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    // Lấy sản phẩm cũ trước khi cập nhật
    const oldProduct = await Product.findById(req.params.id);
    if (!oldProduct) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }

    // Tạo object dữ liệu cập nhật
    let updateData = {};

    // Xử lý variants
    if (req.body.variants) {
      // Validate variants từ req.body
      const variantSchema = productValidation.extract("variants").items[0];
      const variantValidation = Joi.array().items(variantSchema);
      const { error } = variantValidation.validate(req.body.variants, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          message: error.details.map((detail) => detail.message).join(", "),
        });
      }

      if (req.body.replaceVariants === true) {
        // Thay thế toàn bộ variants
        updateData.variants = req.body.variants;
      } else {
        // Chỉ thêm biến thể mới vào mảng cũ
        const newVariants = req.body.variants;
        updateData = {
          $push: { variants: { $each: newVariants } }, // Thêm từng biến thể mới
        };
      }
    }

    // Thêm các trường khác từ req.body (ngoại trừ variants và replaceVariants)
    Object.keys(req.body).forEach((key) => {
      if (key !== "variants" && key !== "replaceVariants") {
        updateData[key] = req.body[key];
      }
    });

    // Nếu không dùng $push, validate toàn bộ dữ liệu
    if (!updateData.$push) {
      const fullUpdateData = {
        ...oldProduct.toObject(), // Lấy dữ liệu cũ
        ...updateData, // Ghi đè bằng dữ liệu mới
      };
      const { error } = productValidation.validate(fullUpdateData, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          message: error.details.map((detail) => detail.message).join(", "),
        });
      }
    }

    // Kiểm tra trùng tên sản phẩm (nếu thay đổi tên)
    if (req.body.name && req.body.name !== oldProduct.name) {
      const existingProduct = await Product.findOne({ name: req.body.name });
      if (existingProduct && existingProduct._id.toString() !== req.params.id) {
        return res.status(400).json({
          message: `Sản phẩm "${req.body.name}" đã tồn tại`,
        });
      }
    }

    // Cập nhật sản phẩm
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        message: "Cập nhật sản phẩm không thành công",
      });
    }

    // Xử lý thay đổi danh mục
    if (
      req.body.categoryId &&
      req.body.categoryId !== oldProduct.categoryId?.toString()
    ) {
      if (oldProduct.categoryId) {
        await Category.findByIdAndUpdate(oldProduct.categoryId, {
          $pull: { products: oldProduct._id },
        });
      }
      const newCategory = await Category.findByIdAndUpdate(
        req.body.categoryId,
        { $addToSet: { products: updatedProduct._id } },
        { new: true }
      );
      if (!newCategory) {
        return res.status(404).json({
          message: "Không tìm thấy danh mục mới để cập nhật",
        });
      }
    }

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
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
