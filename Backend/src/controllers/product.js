import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { productValidation } from "../validation/product.js";
import Color from "../models/Color.js";
import Capacity from "../models/Capacity.js";

export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find()
      .populate({
        path: "categoryId",
        select: "name",
      })
      .populate({
        path: "variants.color",
        select: "name",
      })
      .populate({
        path: "variants.capacity",
        select: "value",
      })
      .lean();

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
      error: error.message,
    });
  }
};

export const getDetailProduct = async (req, res) => {
  try {
    // Lấy ID từ params
    const { id } = req.params;

    // Tìm sản phẩm theo ID và populate các trường liên quan
    const product = await Product.findById(id)
      .populate({
        path: "categoryId",
        select: "name",
      })
      .populate({
        path: "variants.color",
        select: "name",
      })
      .populate({
        path: "variants.capacity",
        select: "value",
      })
      .lean();

    // Kiểm tra nếu không tìm thấy sản phẩm
    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    // Tìm sản phẩm liên quan, lấy tất cả thông tin
    const relatedProducts = await Product.find({
      categoryId: product.categoryId,
      _id: { $ne: product._id },
      status: "active",
    })
      .populate({
        path: "categoryId",
        select: "name",
      })
      .populate({
        path: "variants.color",
        select: "name",
      })
      .populate({
        path: "variants.capacity",
        select: "value",
      })
      .limit(5)
      .lean();

    // Trả về kết quả
    return res.status(200).json({
      message: "Lấy chi tiết sản phẩm thành công",
      data: product,
      relatedProducts,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Đã xảy ra lỗi khi lấy chi tiết sản phẩm",
      error: error.message,
    });
  }
};

// Hàm tạo SKU tự động
const generateSKU = async (productName, colorId, capacityId) => {
  const color = await Color.findById(colorId);
  const capacity = await Capacity.findById(capacityId);

  if (!color || !capacity) {
    throw new Error("Color hoặc Capacity không tồn tại");
  }

  const namePrefix = productName.slice(0, 3).toUpperCase();
  const colorCode = color.name.slice(0, 3).toUpperCase();
  const capacityCode = capacity.value.replace(/[^0-9]/g, "");
  const uniqueCode = Date.now().toString().slice(-4);

  return `${namePrefix}-${colorCode}-${capacityCode}-${uniqueCode}`;
};

export const createProduct = async (req, res) => {
  try {
    // Validate dữ liệu đầu vào
    const { error } = productValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    const { name, variants, categoryId } = req.body;

    // Kiểm tra tên sản phẩm trùng lặp
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({
        message: `Sản phẩm "${name}" đã tồn tại`,
      });
    }

    // Kiểm tra danh mục
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }

    // Kiểm tra trùng lặp color và capacity trong variants
    const variantErrors = [];
    const seenVariants = new Set();

    variants.forEach((variant) => {
      const variantKey = `${variant.color}-${variant.capacity}`;
      if (seenVariants.has(variantKey)) {
        variantErrors.push(`Biến thể với không trùng nhau`);
      }
      seenVariants.add(variantKey);
    });

    if (variantErrors.length > 0) {
      return res.status(400).json({
        message: variantErrors.join(", "),
      });
    }

    // Chuẩn bị và kiểm tra variants
    const preparedVariants = await Promise.all(
      variants.map(async (variant) => {
        const { color, capacity, price, sale, stock } = variant;

        // Kiểm tra color và capacity
        const [colorDoc, capacityDoc] = await Promise.all([
          Color.findById(color),
          Capacity.findById(capacity),
        ]);

        if (!colorDoc) variantErrors.push(`Color ${color} không tồn tại`);
        if (!capacityDoc)
          variantErrors.push(`Capacity ${capacity} không tồn tại`);

        // Tạo SKU
        let sku = "";
        if (colorDoc && capacityDoc) {
          sku = await generateSKU(name, color, capacity);
        }

        return {
          color,
          capacity,
          price,
          sale: sale || 0,
          stock,
          sku,
        };
      })
    );

    if (variantErrors.length > 0) {
      return res.status(400).json({
        message: variantErrors.join(", "),
      });
    }

    // Tạo sản phẩm mới
    const productData = {
      ...req.body,
      variants: preparedVariants,
    };

    const product = new Product(productData);
    const savedProduct = await product.save(); // Middleware sẽ tự động tính salePrice

    // Cập nhật danh mục
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $addToSet: { products: savedProduct._id } },
      { new: true }
    );

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
    const { id } = req.params;
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

    // Nếu cập nhật name, kiểm tra trùng lặp
    if (updateData.name && updateData.name !== product.name) {
      const existingProduct = await Product.findOne({ name: updateData.name });
      if (existingProduct) {
        return res.status(400).json({
          message: `Sản phẩm "${updateData.name}" đã tồn tại`,
        });
      }
      product.name = updateData.name; // Cập nhật name
    }

    // Cập nhật images nếu có
    if (updateData.images) {
      product.images = updateData.images;
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

      await Category.findByIdAndUpdate(product.categoryId, {
        $pull: { products: product._id },
      });
      await Category.findByIdAndUpdate(updateData.categoryId, {
        $addToSet: { products: product._id },
      });
      product.categoryId = updateData.categoryId; // Cập nhật categoryId
    }

    // Nếu cập nhật variants, xóa toàn bộ biến thể cũ và thay bằng biến thể mới
    if (updateData.variants) {
      const variantErrors = [];

      // Kiểm tra trùng lặp trong dữ liệu gửi lên
      const seenNewVariants = new Set();
      updateData.variants.forEach((variant) => {
        const variantKey = `${variant.color}-${variant.capacity}`;
        if (seenNewVariants.has(variantKey)) {
          variantErrors.push(`Biến thể đã trùng lặp trong dữ liệu gửi lên`);
        }
        seenNewVariants.add(variantKey);
      });

      // Chuẩn bị variants mới
      const preparedVariants = await Promise.all(
        updateData.variants.map(async (variant) => {
          const { color, capacity, price, sale, stock, sku } = variant;

          // Kiểm tra color
          const colorDoc = await Color.findById(color);
          if (!colorDoc) {
            variantErrors.push(`Color ${color} không tồn tại`);
          }

          // Kiểm tra capacity
          const capacityDoc = await Capacity.findById(capacity);
          if (!capacityDoc) {
            variantErrors.push(`Capacity ${capacity} không tồn tại`);
          }

          // Nếu không có SKU, sinh mới
          let finalSKU = sku;
          if (colorDoc && capacityDoc && !sku) {
            finalSKU = await generateSKU(
              updateData.name || product.name,
              color,
              capacity
            );
          }

          // Kiểm tra SKU duy nhất (trừ sản phẩm hiện tại)
          if (finalSKU) {
            const existingVariant = await Product.findOne({
              "variants.sku": finalSKU,
              _id: { $ne: id },
            });
            if (existingVariant) {
              variantErrors.push(`SKU "${finalSKU}" đã tồn tại`);
            }
          }

          return {
            color,
            capacity,
            price,
            sale: sale || 0,
            stock,
            sku: finalSKU,
          };
        })
      );

      if (variantErrors.length > 0) {
        return res.status(400).json({
          message: variantErrors.join(", "),
        });
      }

      // Thay thế toàn bộ variants cũ bằng variants mới
      product.variants = preparedVariants;
    }

    // Lưu sản phẩm để chạy middleware pre('save')
    const updatedProduct = await product.save();

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
    const { id } = req.params;

    // Tìm và xóa sản phẩm trong một bước
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }

    // Nếu sản phẩm có categoryId, cập nhật danh mục
    if (deletedProduct.categoryId) {
      const updatedCategory = await Category.findByIdAndUpdate(
        deletedProduct.categoryId,
        { $pull: { products: deletedProduct._id } }, // Xóa product._id khỏi mảng products trong Category
        { new: true } // Trả về document sau khi cập nhật
      );

      // Ghi nhận nếu danh mục không tồn tại, nhưng không làm gián đoạn quá trình
      if (!updatedCategory) {
        console.warn(
          `Danh mục ${deletedProduct.categoryId} không tồn tại để cập nhật`
        );
      }
    }

    // Trả về kết quả thành công
    return res.status(200).json({
      message: "Xóa sản phẩm thành công",
      data: deletedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Đã xảy ra lỗi khi xóa sản phẩm",
      error: error.message, // Thêm chi tiết lỗi để debug
    });
  }
};


export const statusProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Kiểm tra trạng thái đầu vào
    if (!status || !["active", "banned"].includes(status)) {
      return res.status(400).json({
        message:
          "Trạng thái không hợp lệ. Chỉ chấp nhận 'active' hoặc 'banned'",
      });
    }

    // Tìm sản phẩm
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }

    // Kiểm tra nếu trạng thái không thay đổi
    if (product.status === status) {
      return res.status(400).json({
        message: `Sản phẩm đã ở trạng thái "${status}"`,
      });
    }

    // Cập nhật trạng thái sản phẩm
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true } // Trả về document mới và chạy validation
    );

    if (!updatedProduct) {
      return res.status(500).json({
        message: "Cập nhật trạng thái sản phẩm không thành công",
      });
    }

    return res.status(200).json({
      message: "Chuyển trạng thái sản phẩm thành công",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Đã xảy ra lỗi khi chuyển trạng thái sản phẩm",
    });
  }
};

// API tim kiem san pham theo name
export const searchProductByName = async (req, res) => {
  try {
    const { name } = req.body; //nhap tu khoa va kiem tra da nhap chua
    if (!name) {
      return res.status(400).json({
        message: "Nhập tên sản phẩm!",
      });
    }
    //tim kiem name
    const products = await Product.find({ $text: { $search: name } }).populate(
      "categoryId"
    );
    //neu khong co san pham ton tai
    if (products.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm!",
      });
    }

    //tim thay thi in ra
    res.status(200).json({
      message: "Tìm kiếm sản phẩm thành công!",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tìm kiếm sản phẩm!",
      error: error.message,
    });
  }
};
