
import { http } from "../config/axios";


export type Category = {
  _id: string;
  name: string;
};

export type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  color: string;
  categoryId?: string | Category; // Hỗ trợ cả string và object
};


export const getAllProduct = () => {
  return http.get("/product");
};
export const addProduct = (product:Product) => {
  return http.post("/product",product)
}
export const removeProduct = (_id:string) => {
  return http.delete("/product/"+_id)
}

export const getProductById = (_id: string ) => {
  return http.get(`/product/${_id}`);
};
export const updateProduct = (_id: string, product: Product) => {
  return http.put("/product/" + _id, product);
};
export const searchProduct = async(name:string) => {
  try {
    return http.post("/product/search",{name})
  } catch (error) {
    console.log(error)
  }
}

