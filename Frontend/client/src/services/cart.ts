import { http } from "../config/axios";
export type Carts = {
    userId: string;
    items: {
        productId: string;
        variantId: string;
        quantity: number;
    }[];
};
export const addCart = (cart: Carts) => {
    return http.post("/cart", cart);
}
export const getCart = (userId: string) => {
    return http.get(`/cart/${userId}`);
}
export const deleteCart = (userId: string, productId: string) => {
    return http.delete(`/cart/${userId}/${productId}`);
}
export const updateCart = (userId: string, productId: string, quantity: number) => {
    return http.put(`/cart/${userId}`, { productId, quantity });
}

