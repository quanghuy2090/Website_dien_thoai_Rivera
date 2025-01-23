
import { http } from "../config/axios";

export type Category = {
    _id: string;
    name: string;
    slug: string;
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