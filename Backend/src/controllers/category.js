import Category from "../models/Category.js";
import { categoryValidation } from "../validation/category.js";

// Hàm tạo slug từ tên
const createSlug = (name) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const getAll = async (req, res) => {
  try {
    const data = await Category.find({
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }, // Tìm cả các danh mục chưa có trường isDeleted
      ],
    })
      .sort({ updatedAt: -1 }) // Sắp xếp theo thời gian cập nhật mới nhất
      .populate({
        path: "products",
        select: "name price images slug", // Chỉ lấy các trường cần thiết
      })
      .populate("updatedBy", "userName email");

    // Đếm tổng số danh mục chưa bị xóa
    const total = await Category.countDocuments({
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
    });

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục nào",
      });
    }
    return res.status(200).json({
      message: "Lấy danh sách danh mục thành công",
      total: total, // Thêm tổng số danh mục
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy danh sách danh mục",
      error: error.message,
    });
  }
};
export const getDetail = async (req, res) => {
  try {
    const data = await Category.findById(req.params.id)
      .populate({
        path: "products",
        select: "name price images slug description variants", // Thêm các trường cần thiết
        populate: [
          { path: "variants.color" }, // Populate color trong variants
          { path: "variants.capacity" }, // Populate capacity trong variants
        ],
      })
      .populate("updatedBy", "userName email"); // Populate thông tin người chỉnh sửa

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục",
      });
    }

    // Đếm số sản phẩm trong danh mục
    const totalProducts = data.products.length;

    return res.status(200).json({
      message: "Lấy thông tin danh mục thành công",
      totalProducts: totalProducts,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy thông tin danh mục",
      error: error.message,
    });
  }
};
export const create = async (req, res) => {
  try {
    const { error } = categoryValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    // Tạo slug từ tên danh mục
    const slug = createSlug(req.body.name);

    // Kiểm tra xem tên danh mục đã tồn tại chưa
    const existingCategory = await Category.findOne({
      $or: [{ name: req.body.name }, { slug: slug }],
    });
    if (existingCategory) {
      return res.status(400).json({
        message:
          existingCategory.name === req.body.name
            ? "Tên danh mục đã tồn tại"
            : "Slug danh mục đã tồn tại",
      });
    }

    // Tạo danh mục mới với slug tự động
    const data = await Category.create({
      ...req.body,
      slug: slug,
    });

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Tạo danh mục không thành công",
      });
    }
    return res.status(200).json({
      message: "Tạo danh mục thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};
export const update = async (req, res) => {
  try {
    const { error } = categoryValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    // Tạo slug mới nếu tên thay đổi
    const slug = createSlug(req.body.name);

    // Kiểm tra xem tên hoặc slug mới đã tồn tại chưa (trừ chính danh mục đang update)
    const existingCategory = await Category.findOne({
      _id: { $ne: req.params.id },
      $or: [{ name: req.body.name }, { slug: slug }],
    });
    if (existingCategory) {
      return res.status(400).json({
        message:
          existingCategory.name === req.body.name
            ? "Tên danh mục đã tồn tại"
            : "Slug danh mục đã tồn tại",
      });
    }

    const data = await Category.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        slug: slug,
        updatedBy: req.user._id, // Thêm ID của người dùng đang thực hiện update
      },
      { new: true }
    ).populate("updatedBy", "userName email"); // Populate thông tin người chỉnh sửa

    if (!data) {
      return res.status(404).json({
        message: "Cập nhật danh mục không thành công",
      });
    }
    return res.status(200).json({
      message: "Cập nhật danh mục thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};
export const remove = async (req, res) => {
  try {
    // Kiểm tra danh mục có tồn tại không
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục cần xóa",
      });
    }

    // Kiểm tra danh mục có sản phẩm không
    if (category.products && category.products.length > 0) {
      return res.status(400).json({
        message: "Không thể xóa danh mục đang chứa sản phẩm",
      });
    }

    // Thực hiện soft delete - đánh dấu danh mục đã xóa
    const data = await Category.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
        deletedBy: req.user._id,
      },
      { new: true }
    ).populate("deletedBy", "userName email");

    return res.status(200).json({
      message: "Xóa danh mục thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi xóa danh mục",
      error: error.message,
    });
  }
};
export const searchCategoryByName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Bạn cần phải nhập tên danh mục cần tìm",
      });
    }

    // Tìm kiếm danh mục bằng regex (nếu không muốn dùng `$text`)
    const categories = await Category.find({
      name: { $regex: name, $options: "i" }, // "i" để không phân biệt hoa/thường
    });

    if (categories.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục",
      });
    }

    res.status(200).json({
      message: "Tìm thấy danh mục",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Đã xảy ra lỗi khi tìm kiếm danh mục",
      error: error.message,
    });
  }
};
export const getDeletedCategories = async (req, res) => {
  try {
    const data = await Category.find({ isDeleted: true })
      .sort({ updatedAt: -1 }) // Sắp xếp theo thời gian xóa mới nhất
      .populate({
        path: "products",
        select: "name price images slug", // Chỉ lấy các trường cần thiết
      })
      .populate("deletedBy", "userName email"); // Populate thông tin người xóa

    // Đếm tổng số danh mục đã bị xóa
    const total = await Category.countDocuments({ isDeleted: true });

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục đã xóa nào",
      });
    }

    return res.status(200).json({
      message: "Lấy danh sách danh mục đã xóa thành công",
      total: total,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy danh sách danh mục đã xóa",
      error: error.message,
    });
  }
};

//hàm khôi phục danh mục đã xóa
export const restoreCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục cần khôi phục",
      });
    }

    if (!category.isDeleted) {
      return res.status(400).json({
        message: "Danh mục này chưa bị xóa",
      });
    }

    // Khôi phục danh mục
    const data = await Category.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: false,
        deletedBy: null, // Xóa thông tin người xóa
      },
      { new: true }
    ).populate("updatedBy", "userName email");

    return res.status(200).json({
      message: "Khôi phục danh mục thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi khôi phục danh mục",
      error: error.message,
    });
  }
};
