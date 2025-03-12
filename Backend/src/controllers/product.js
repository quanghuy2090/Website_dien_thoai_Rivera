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
    // Kiểm tra SKU có trùng lặp không
    const existingVariant = await Product.findOne({ "variants.sku": { $in: req.body.variants.map(v => v.sku) } });

    if (existingVariant) {
      return res.status(400).json({
        message: "SKU đã tồn tại, vui lòng chọn SKU khác",
      });
    }


    // Kiểm tra xem danh mục có tồn tại không trước khi tạo sản phẩm
    const category = await Category.findById(req.body.categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
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
        $addToSet: { products: savedProduct._id }, // Thêm product._id vào mảng products của Category
      },
      { new: true } // Trả về document sau khi cập nhật
    );

    // Nếu cập nhật danh mục thất bại
    if (!updatedCategory) {
      // Xóa sản phẩm vừa tạo để đảm bảo tính nhất quán
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

    // Validate dữ liệu đầu vào
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

    // Nếu cập nhật name, kiểm tra trùng lặp (trừ chính sản phẩm đang cập nhật)
    if (updateData.name && updateData.name !== product.name) {
      const existingProduct = await Product.findOne({ name: updateData.name });
      if (existingProduct) {
        return res.status(400).json({
          message: `Sản phẩm "${updateData.name}" đã tồn tại`,
        });
      }
    }

    // Nếu cập nhật categoryId, kiểm tra danh mục có tồn tại không
    if (updateData.categoryId && updateData.categoryId !== product.categoryId.toString()) {
      const category = await Category.findById(updateData.categoryId);
      if (!category) {
        return res.status(404).json({
          message: "Danh mục không tồn tại",
        });
      }

      // Cập nhật mảng products trong Category
      await Category.findByIdAndUpdate(product.categoryId, {
        $pull: { products: product._id }, // Xóa sản phẩm khỏi danh mục cũ
      });
      await Category.findByIdAndUpdate(updateData.categoryId, {
        $addToSet: { products: product._id }, // Thêm sản phẩm vào danh mục mới
      });
    }

    // Nếu cập nhật variants, kiểm tra SKU duy nhất
    if (updateData.variants) {
      for (const variant of updateData.variants) {
        if (variant.sku && variant.sku !== product.variants.find(v => v.sku === variant.sku)?.sku) {
          const existingVariant = await Product.findOne({ "variants.sku": variant.sku });
          if (existingVariant) {
            return res.status(400).json({
              message: `SKU "${variant.sku}" đã tồn tại trong một sản phẩm khác`,
            });
          }
        }
      }
    }

    // Cập nhật sản phẩm
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true } // Trả về document mới và chạy validation của Mongoose
    );

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
