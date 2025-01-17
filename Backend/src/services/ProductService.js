const Product = require("../models/ProductModel");
//them san pham
const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, image, type, price, countInStock, rating, description } =
        newProduct;
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "OK",
          message: "The name of product is already",
        });
      }
      const newwProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        description,
      });
      if (newwProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newwProduct,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
//sua san pham
const updateProduct = async (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm product theo id
      const checkProduct = await Product.findOne({ _id: id });
      // Nếu product không tồn tại
      if (checkProduct === null) {
        resolve({
          status: "Ok",
          message: "The product is not defined",
        });
      }
      // Cập nhật product
      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      // Trả về thành công
      resolve({
        status: "ok",
        message: "success",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};
//xoa san pham
const deleteProduct = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm user theo id
      const checkProduct = await Product.findOne({ _id: id });
      // Nếu user không tồn tại
      if (checkProduct === null) {
        resolve({
          status: "Ok",
          message: "The product is not defined",
        });
      }
      await Product.findByIdAndDelete(id);
      // Trả về thành công
      resolve({
        status: "Ok",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
//hien thi tat ca san pham
const getAllProduct = async (limit, page, sort, filter) => {
  // console.log("sort:", sort);
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();
      if (filter) {
        const label = filter[0];
        const allProductFilter = await Product.find({
          [label]: {
            '$regex': filter[1]
          }
        }).limit(limit).skip(page * limit);
        resolve({
          status: "Ok",
          message: "GetAll product success",
          data: allProductFilter,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        // console.log("objectSort:", objectSort);
        const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort);
        resolve({
          status: "Ok",
          message: "GetAll product success",
          data: allProductSort,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      const allProduct = await Product.find().limit(limit).skip(page * limit);
      // Trả về thành công
      resolve({
        status: "Ok",
        message: "GetAll product success",
        data: allProduct,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};
//Hien thi chi tiet san pham
const getDetailsProduct = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm user theo id
      const product = await Product.findOne({ _id: id });
      // Nếu user không tồn tại
      if (product === null) {
        resolve({
          status: "Ok",
          message: "The product is not defined",
        });
      }
      // Trả về thành công
      resolve({
        status: "Ok",
        message: "Get Detail product success",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
};
