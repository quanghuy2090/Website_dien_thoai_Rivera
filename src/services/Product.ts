import { http } from "../config/axios";

export type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
};

export const getAll = () => {
  return http.get("/products");
};

export const getDetail = (id: string) => {
  return http.get(`/products/${id}`);
};
