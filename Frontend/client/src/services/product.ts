
import { http } from "../config/axios";
import { Capacity } from "./capacity";
import { Color } from "./color";
export type Category = {
  _id: string;
  name: string;
}
export type Variants = {
  _id: string;
  color: string | Color;
  capacity: string | Capacity;
  price: number;
  stock: number;
  sku: string;
  sale: number;
  salePrice: number;
}
export type Product = {
  _id: string;
  name: string;
  short_description: string;
  long_description: string;
  images: string[];
  variants: Variants[];
  categoryId?: string | Category; // Hỗ trợ cả string và object
  is_hot: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};


export const getAllProduct = () => {
  return http.get("/product");
};
export const addProduct = (product: Product) => {
  return http.post("/product", product)
}
export const removeProduct = (_id: string) => {
  return http.delete("/product/" + _id)
}

export const getProductById = (_id: string) => {
  return http.get(`/product/${_id}`);
};
export const updateProduct = (_id: string, product: Product) => {
  return http.put("/product/" + _id, product);
};
export const searchProduct = async (name: string) => {
  try {
    return http.post("/product/search", { name })
  } catch (error) {
    console.log(error)
  }
};
export const updateProductStatus = async (_id: string, status: string) => {
  return http.put(`/product/status/${_id}`, { status })
}
export const updateProductIs_Hot = async (_id: string, is_hot: string) => {
  return http.patch(`/product/isHot/${_id}`, { is_hot })
}

