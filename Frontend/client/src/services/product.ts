import { http } from "../config/axios";

export type Product = {
  id: string | number;
  name: string;
  price: number;
  brand: string;
  releaseDate: Date;
  discount: number;
  stock: number;
  images: string;
  description: string;
};

export const getAllProduct = () => {
  return http.get("/products");
};

