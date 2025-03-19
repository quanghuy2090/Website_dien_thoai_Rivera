import { http } from "../config/axios";
import { Variants } from "./product";
export type Carts = {
    _id: string;
    userId: string;
    productId: string; // Đúng với API
    name: string; // Bổ sung để phù hợp với API
    image: string; // API có trả về image
    variants: Variants[]; // Đổi variantId thành object Variants (API đã gửi đầy đủ)
    quantity: number;
    subtotal: number; // API có subtotal
};

export const addCart = (cart: Carts) => {
    return http.post("/cart", cart);
}
export const getCart = () => {
    return http.get(`/cart`);
}
export const deleteCart = (productId: string) => {
    return http.delete(`/cart/${productId}`);
}
export const deleteAllCart = (_id: string) => {
    return http.delete(`/cart/removeAll/${_id}`)
}
export const updateCart = (userId: string, productId: string, quantity: number) => {
    return http.put(`/cart/${userId}`, { productId, quantity });
}

