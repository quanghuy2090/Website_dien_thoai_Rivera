import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// Tổng doanh thu
export const getTotalRevenue = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $match: {
          status: { $in: ["Hoàn thành", "Đã nhận hàng"] },
          paymentStatus: "Đã thanh toán",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;

    return res.status(200).json({
      message: "Lấy tổng doanh thu thành công",
      data: {
        totalRevenue,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi lấy tổng doanh thu",
      error: error.message,
    });
  }
};

// Top 5 user mua hàng nhiều nhất
export const getTopUsers = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $match: {
          status: { $in: ["Hoàn thành", "Đã nhận hàng"] },
          paymentStatus: "Đã thanh toán",
        },
      },
      {
        $group: {
          _id: "$userId",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { totalSpent: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          _id: 1,
          userName: "$userInfo.userName",
          email: "$userInfo.email",
          totalOrders: 1,
          totalSpent: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: "Lấy top 5 người dùng mua hàng nhiều nhất thành công",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi lấy top người dùng",
      error: error.message,
    });
  }
};

// Top 5 sản phẩm bán chạy nhất
export const getTopProducts = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $match: {
          status: { $in: ["Hoàn thành", "Đã nhận hàng"] },
          paymentStatus: "Đã thanh toán",
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.productId",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: "$productInfo",
      },
      {
        $project: {
          _id: 1,
          name: "$productInfo.name",
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: "Lấy top 5 sản phẩm bán chạy nhất thành công",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi lấy top sản phẩm bán chạy",
      error: error.message,
    });
  }
};

// Top 5 sản phẩm bán được ít nhất
export const getLeastSoldProducts = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $match: {
          status: { $in: ["Hoàn thành", "Đã nhận hàng"] },
          paymentStatus: "Đã thanh toán",
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.productId",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      {
        $sort: { totalQuantity: 1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: "$productInfo",
      },
      {
        $project: {
          _id: 1,
          name: "$productInfo.name",
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: "Lấy top 5 sản phẩm bán được ít nhất thành công",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi lấy top sản phẩm bán ít",
      error: error.message,
    });
  }
};
