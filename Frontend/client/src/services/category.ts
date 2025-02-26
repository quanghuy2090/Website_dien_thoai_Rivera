
import { http } from "../config/axios";
import { Product } from "./product";

export type Category = {
    _id: string;
    name: string;
    slug: string;
    products?: Product[];
}

export const addCategories = (category:Category) => {
    return http.post("/category",category)
}
export const getCategories = () => {
    return http.get("/category")
}
export const deleteCategories = (_id: string) => {
    return http.delete("/category/"+_id)
}
export const getCategoriesById = (_id: string) => {
    return http.get(`/category/${_id}`);
}

export const updateCategories = (_id:string,category: Category) => {
    return http.put(`/category/${_id}`,category);
}
export const searchCategory = async(name:string) => {
  try {
    return http.post("/category/search",{name})
  } catch (error) {
    console.log(error)
  }
}