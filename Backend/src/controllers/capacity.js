import Capacity from "../models/Capacity.js";
import Product from "../models/Product.js";

export const createCapacity = async (req, res) => {
  const { value } = req.body;
  try {
    const newCapacity = new Capacity({ value });
    await newCapacity.save();
    res.status(201).json({
      message: "Thêm dung lượng thành công!",
      data: newCapacity,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllCapacities = async (req, res) => {
  try {
    const capacities = await Capacity.find();
    res.status(200).json({
      message: "Danh sách dung lượng!",
      data: capacities,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCapacity = async (req, res) => {
  const { value } = req.body;
  try {
    const trimmedValue = value?.trim(); // Xử lý khoảng trắng
    if (!trimmedValue) {
      return res.status(400).json({ error: "Giá trị dung lượng không được để trống" });
    }
    const capacity = await Capacity.findByIdAndUpdate(
      req.params.id,
      { value: trimmedValue },
      { new: true }
    );
    if (!capacity) return res.status(404).json({ error: "Không tìm thấy dung lượng" });
    res.status(200).json({
      message: "Sửa dung lượng thành công!",
      data: capacity,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "ID dung lượng không hợp lệ" });
    }
    res.status(400).json({ error: error.message });
  }
};

export const deleteCapacity = async (req, res) => {
  try {
    // Tìm dung lượng theo _id
    const capacity = await Capacity.findById(req.params.id);
    if (!capacity) return res.status(404).json({ error: "Không tìm thấy dung lượng" });

    // Kiểm tra xem dung lượng có đang được sử dụng trong product không (theo _id)
    const productsUsingCapacity = await Product.find({ "variants.capacity": capacity._id });
    if (productsUsingCapacity.length > 0) {
      return res.status(400).json({
        error: "Không thể xóa dung lượng này vì nó đang được sử dụng trong sản phẩm",
      });
    }

    // Xóa dung lượng theo _id
    await Capacity.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "ID dung lượng không hợp lệ" });
    }
    res.status(400).json({ error: error.message });
  }
};