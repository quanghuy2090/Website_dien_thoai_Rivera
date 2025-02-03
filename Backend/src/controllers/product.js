import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { productValidation } from "../validation/product.js";

export const getAll = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId");
    if (!products || products.length === 0) {
      return res.status(404).json({
        message: "Khong co san pham",
      });
    }
    return res.status(200).json({
      message: "Lay san pham thanh cong!",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const getDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId"
    );
    if (!product) {
      return res.status(404).json({
        message: "Khong co san pham",
      });
    }
    return res.status(200).json({
      message: "Lay chi tiet san pham thanh cong!",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const create = async (req, res) => {
  try {
    const { error } = productValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const product = await Product.create(req.body);
    if (!product) {
      return res.status(404).json({
        message: "Tao san pham khong moi thanh cong",
      });
    }

    const updateCategory = await Category.findByIdAndUpdate(
      req.body.categoryId,
      {
        $addToSet: {
          products: product._id,
        },
      }
    );

    if (!updateCategory) {
      return res.status(404).json({
        message: "Update category not successful",
      });
    }

    return res.status(200).json({
      message: "Tao san pham moi thanh cong",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    // Validate dữ liệu từ body
    const { error } = productValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    // Cập nhật sản phẩm
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Trả về dữ liệu đã cập nhật
    });
    if (!product) {
      return res.status(404).json({
        message: "Cập nhật sản phẩm không thành công",
      });
    }
    // Cập nhật category (nếu có categoryId trong body)
    if (req.body.categoryId) {
      const updateCategory = await Category.findByIdAndUpdate(
        req.body.categoryId,
        {
          $addToSet: {
            products: product._id,
          },
        }
      );
      if (!updateCategory) {
        return res.status(404).json({
          message: "Cập nhật danh mục không thành công",
        });
      }
    }

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const data = await Product.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({
        message: "Xoa san pham khong thanh cong",
      });
    }
    return res.status(200).json({
      message: "Xoa san pham thanh cong",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
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
    const products = await Product.find({ $text: { $search: name } });
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
