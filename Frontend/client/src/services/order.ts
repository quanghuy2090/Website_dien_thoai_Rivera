import { http } from "../config/axios";
import { User } from "./auth";
import { Carts } from "./cart";


export type IShippingAddress = {
  name: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
};
export type Order = {
  orderId: string;
  userId: User;
  items: Carts[];
  shippingAddress: IShippingAddress;
  paymentMethod: "COD" | "Online" | "Credit Card" | "Bank Transfer";
  paymentStatus: "Chưa thanh toán" | "Đã thanh toán";
  totalAmount: number;
  status:
  | "Chưa xác nhận"
  | "Đã xác nhận"
  | "Đang giao hàng"
  | "Đã giao hàng"
  | "Hoàn thành"
  | "Đã huỷ";
  cancelReason: string;
  createdAt: Date;
  updatedAt: Date;
};
export type Ward = {
  code: number;
  name: string;
};
export type District = {
  code: number;
  name: string;
  wards: Ward[];
};
export type Province = {
  code: number;
  name: string;
  districts: District[];
};

export const createOrder = (
  order: Omit<Order, "_id" | "createdAt" | "updatedAt">
) => {
  return http.post("/order/cod", order);
};

export const createOrderOnline = (
  order: Omit<Order, "_id" | "createdAt" | "updatedAt" | "paymentStatus" | "status" | "totalAmount" | "items"> & { orderItems: Carts[] }
) => {
  return http.post<{ paymentUrl: string; order: Order }>("/order/online", order); // Backend trả về paymentUrl
};

export const getOrderUser = (userId: string) => {
  return http.get(`/order/${userId}`);
};

export const getAllOrder = () => {
  return http.get("/order");
};
export const getDetailOrder = (orderId: string) => {
  return http.get(`/order/${orderId}`);
};
export const updateStatusOrder = (
  orderId: string,
  orderStatus: Order["status"],
  cancellationReason: string
) => {
  return http.put(`/order/${orderId}`, { orderStatus, cancellationReason });
};
