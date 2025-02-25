import { http } from "../config/axios";
import { Carts } from "./cart";

export type IShippingAddress = {
    fullName: string;
    phone: string; 
    address: string;
    ward: string;
    district: string;
    city: string;
    
}
export type Order = {
    _id: string;
    userId: string;
    orderItems: Carts[];
    shippingAddress: IShippingAddress;
    paymentMethod: "COD" | "Credit Card" | "Bank Transfer";
    paymentStatus: "Chưa thanh toán" | "Đã thanh toán";
    totalPrice: number;
    orderStatus: "Chưa xác nhận" | "Đã xác nhận" | "Đang giao hàng" | "Đã giao hàng" | "Hoàn thành" | "Đã huỷ";
    cancellationReason?: string;
    cancelledByAdmin?: string;
    createdAt: Date;
    updatedAt: Date;
};
export type Ward = {
    code: number;
    name: string;
}
export type District = {
    code: number;
    name: string;
    wards: Ward[];
}
export type Province = {
    code: number;
    name: string;
    districts: District[];
}

export const createOrder = (order: Omit<Order, "_id" | "createdAt" | "updatedAt">) => {
    return http.post("/order", order);
}

export const getOrderUser = (userId:string) => {
    return http.get(`/order/${userId}`);
}


