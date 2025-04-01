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
    const data = await Category.find({}).populate("products");

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "No category",
      });
    }
    return res.status(200).json({
      message: "Category has been",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};
export const getDetail = async (req, res) => {
  try {
    const data = await Category.findById(req.params.id).populate({
      path: "products",
      populate: [
        { path: "variants.color" }, // Populate color trong variants
        { path: "variants.capacity" }, // Populate capacity trong variants
      ],
    });

    if (!data) {
      return res.status(404).json({
        message: "No category",
      });
    }
    return res.status(200).json({
      message: "Category has been",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
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
    const data = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Update category not successful",
      });
    }
    return res.status(200).json({
      message: "Update category successful",
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
    const data = await Category.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Delete category not successful",
      });
    }
    return res.status(200).json({
      message: "Delete category successful",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
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
