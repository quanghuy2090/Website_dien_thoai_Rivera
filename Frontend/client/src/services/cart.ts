import { http } from "../config/axios";
import { Product } from "./product";


export type Cart = {
    _id: string;
    product?: Product;
    userId: string;
    quantity: number;
    productId: string;
};


export const addCart = (cart:Cart) => {
    return http.post("/cart", cart);
}

