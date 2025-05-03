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
    const capacities = await Capacity.find({ isDeleted: false });
    res.status(200).json({
      message: "Danh sách dung lượng!",
      data: capacities,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getCapacityDetail = async (req, res) => {
  try {
    const capacity = await Capacity.findById(req.params.id);
    if (!capacity) {
      return res.status(404).json({ error: "Không tìm thấy dung lượng" });
    }
    res.status(200).json({
      message: "Thông tin chi tiết dung lượng!",
      data: capacity,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "ID dung lượng không hợp lệ" });
    }
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
    const capacity = await Capacity.findById(req.params.id);
    if (!capacity) {
      return res.status(404).json({ error: "Không tìm thấy bộ nhớ" })
    }
    if (capacity.isDeleted) {
      return res.status(400).json({ error: "bộ nhớ đã được xóa mềm" })
    }

    const productsUsingCapacity = await Product.find({ "variants.capacity": capacity._id });
    if (productsUsingCapacity.length > 0) {
      return res.status(400).json({
        error: "Không thể xóa bộ nhớ  này vì nó đang được sử dụng trong sản phẩm"
      })
    }

    await Capacity.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "Xóa mềm thành công" })
  } catch (error) {
    if (error.value === "CastError") {
      return res.status(400).json({ error: "ID bộ nhớ  không hợp lệ" });
    }
    res.status(400).json({ error: error.message });
  }
};

export const restoreCapacity = async (req, res) => {
  try {
    const capacity = await Capacity.findById(req.params.id);
    if (!capacity) {
      return res.status(404).json({ error: "Không tìm thấy bộ nhớ " })
    }
    if (!capacity.isDeleted) {
      return res.status(400).json({ error: "bộ nhớ  này chưa được xóa mềm" })
    }
    await Capacity.findByIdAndUpdate(req.params.id, { isDeleted: false });
    res.json({ message: "Khôi phục bộ nhớ thành công" })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getDeletedCapacity = async (req, res) => {
  try {
    const deletedCapacity = await Capacity.find({ isDeleted: true });
    res.status(200).json({
      message: "Danh sách biến thể bộ nhớ đã xóa!",
      data: deletedCapacity,
    })
  } catch (error) {
    console.error("Error in getDeletedColors:", error);
    res.status(500).json({ error: error.message });
  }
}