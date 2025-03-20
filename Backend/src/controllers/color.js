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
    const colors = await Color.find();
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
      // Tìm màu theo _id
      const color = await Color.findById(req.params.id);
      if (!color) return res.status(404).json({ error: "Không tìm thấy màu" });
  
      // Kiểm tra xem màu có đang được sử dụng trong product không (theo _id)
      const productsUsingColor = await Product.find({ "variants.color": color._id });
      if (productsUsingColor.length > 0) {
        return res.status(400).json({
          error: "Không thể xóa màu này vì nó đang được sử dụng trong sản phẩm",
        });
      }
  
      // Xóa màu theo _id
      await Color.findByIdAndDelete(req.params.id);
      res.json({ message: "Xóa thành công" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
