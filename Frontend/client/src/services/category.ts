
import { http } from "../config/axios";
import { User } from "./auth";
import { Product } from "./product";

export type Category = {
  _id: string;
  name: string;
  slug: string;
  products?: Product[];
  deletedBy: User;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const addCategories = (category: Category) => {
  return http.post("/category", category)
}
export const getCategories = () => {
  return http.get("/category")
}
export const deleteCategories = (_id: string) => {
  return http.delete("/category/" + _id)
}
export const getCategoriesById = (_id: string) => {
  return http.get(`/category/${_id}`);
}

export const getCategoriesDeleted = () => {
  return http.get(`/category/deleted`)
}

export const updateCategories = (_id: string, category: Category) => {
  return http.put(`/category/${_id}`, category);
}

export const updateCategoryRestore = (_id: string, category: Category) => {
  return http.patch(`/category/restore/${_id}`, category);
}
export const searchCategory = async (name: string) => {
  try {
    return http.post("/category/search", { name })
  } catch (error) {
    console.log(error)
  }
}