import { http } from "../config/axios";
export interface CartItem {
    productId: {
        _id: string;
        name: string;
        images: string;
        variants: {
            _id: string;
            color: { name: string };
            capacity: { value: string };
        }[];

    };  // Mongoose ObjectId (string trên frontend
    variantId: string;
    quantity: number;
    price: number;
    sale: string;
    salePrice: number;
    color: string;  // Chuyển thành string để tránh lỗi kiểu dữ liệu
    capacity: string;  // Chuyển thành string để tránh lỗi kiểu dữ liệu
    subtotal: number;  // Tổng giá trị (quantity * salePrice)
    snapshot?: {
        name: string;
        image: string;
        price: number;
        color: string;
        capacity: string;
    };
}

// Định nghĩa Carts chính
export interface Carts {
    _id: string;
    userId: string;
    items: CartItem[];
    totalPrice: number;
    totalSalePrice: number;
    createdAt?: string; // Thêm nếu backend có
    updatedAt?: string; // Thêm nếu backend có
}

export const addCart = (cart: Carts) => {
    return http.post("/cart", cart);
}
export const getCart = () => {
    return http.get(`/cart`);
}
export const deleteCart = (productId: string, variantId: string) => {
    return http.delete(`/cart`, { data: { productId, variantId } });
};

export const deleteAllCart = () => {
    return http.delete(`/cart/removeAll`)
}
export const updateCart = (productId: string, variantId: string, quantity: number) => {
    return http.put(`/cart/`, { productId, variantId, quantity });
};

