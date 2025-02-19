import { http } from "../config/axios";
import { Product } from "./product";


export type Carts = {
    _id: string;
    userId: string;
    quantity: number;
    productId: Product;
};


export const addCart = (cart:Carts) => {
    return http.post("/cart", cart);
}
export const getCart = (userId: string) => {
    return http.get(`/cart/${userId}`);
}
export const deleteCart = (userId:string,productId:string) => {
    return http.delete(`/cart/${userId}/${productId}`);
}

