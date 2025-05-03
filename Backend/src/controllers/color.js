import Color from "../models/Color.js";
import Product from "../models/Product.js";
export const createColor = async (req, res) => {
  const { name } = req.body;
  try {
    const newColor = new Color({ name });
    await newColor.save();
    res.status(201).json({
      message: "Thêm biến thể màu thành công!",
      data: newColor,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllColors = async (req, res) => {
  try {
    const colors = await Color.find({ isDeleted: false });
    res.status(200).json({
      message: "Danh sách biến thể màu!",
      data: colors,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getColorDetail = async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) {
      return res.status(404).json({ error: "Không tìm thấy màu" });
    }
    res.status(200).json({
      message: "Thông tin chi tiết màu!",
      data: color,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "ID màu không hợp lệ" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const updateColor = async (req, res) => {
  const { name } = req.body;
  try {
    const trimmedName = name?.trim();
    if (!trimmedName) {
      return res.status(400).json({ error: "Tên màu không được để trống" });
    }
    const color = await Color.findByIdAndUpdate(
      req.params.id,
      { name: trimmedName },
      { new: true }
    );
    if (!color) return res.status(404).json({ error: "Không tìm thấy màu" });
    res.status(200).json({
      message: "Sửa biến thể màu thành công!",
      data: color,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const deleteColor = async (req, res) => {
  try {
    // Find the color by ID
    const color = await Color.findById(req.params.id);
    if (!color) {
      return res.status(404).json({ error: "Không tìm thấy màu" });
    }

    // Check if the color is already soft-deleted
    if (color.isDeleted) {
      return res.status(400).json({ error: "Màu này đã được xóa mềm" });
    }

    // Check if the color is used in any product's variants
    const productsUsingColor = await Product.find({ "variants.color": color._id });
    if (productsUsingColor.length > 0) {
      return res.status(400).json({
        error: "Không thể xóa màu này vì nó đang được sử dụng trong sản phẩm",
      });
    }

    // Perform soft delete by setting isDeleted to true
    await Color.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "Xóa mềm thành công" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "ID màu không hợp lệ" });
    }
    res.status(400).json({ error: error.message });
  }
};

export const restoreColor = async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) {
      return res.status(404).json({ error: "Không tìm thấy màu" });
    }

    if (!color.isDeleted) {
      return res.status(400).json({ error: "Màu này chưa được xóa mềm" });
    }

    await Color.findByIdAndUpdate(req.params.id, { isDeleted: false });
    res.json({ message: "Khôi phục màu thành công" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const getDeletedColors = async (req, res) => {
  try {
    const deletedColors = await Color.find({ isDeleted: true });
    res.status(200).json({
      message: "Danh sách biến thể màu đã xóa!",
      data: deletedColors,
    });
  } catch (error) {
    console.error("Error in getDeletedColors:", error);
    res.status(500).json({ error: error.message });
  }
};