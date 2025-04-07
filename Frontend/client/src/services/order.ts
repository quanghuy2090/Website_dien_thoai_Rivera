import { http } from "../config/axios";
import { User } from "./auth";
import { CartItem, Carts } from "./cart";

export type IShippingAddress = {
  name: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
};

export type Order = {
  _id: string;
  orderId: string;
  userId: User;
  items: CartItem[];
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
    | "Đã hủy";
  cancelReason: string;
  userName: string;
  userEmail: string;
  userPhone: string;
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
  order: Omit<
    Order,
    | "_id"
    | "createdAt"
    | "updatedAt"
    | "paymentStatus"
    | "status"
    | "totalAmount"
    | "items"
  > & { orderItems: Carts[] }
) => {
  return http.post<{ paymentUrl: string; order: Order }>(
    "/order/online",
    order
  );
};

export const getOrderUser = (userId: string) => {
  return http.get(`/order/${userId}`);
};

export const getAllOrder = () => {
  return http.get<{ message: string; orders: Order[] }>("/order");
};

export const getDetailOrder = (orderId: string) => {
  return http.get<{ message: string; order: Order }>(`/order/${orderId}`);
};

export const updateStatusCustomerOrder = (
  orderId: string,
  status: "Đã nhận hàng" | "Đã hủy",
  cancellationReason: string
) => {
  if (status === "Đã hủy" && !cancellationReason.trim()) {
    throw new Error("Vui lòng nhập lý do hủy đơn hàng");
  }

  return http.put<{ message: string; order: Order }>(
    `/order/customer/status/${orderId}`,
    {
      status,
      cancelReason: cancellationReason,
    }
  );
};

export const updateStatusOrder = (
  orderId: string,
  status: Order["status"],
  cancellationReason: string
) => {
  return http.put<{ message: string; order: Order }>(
    `/order/status/${orderId}`,
    {
      status,
      cancelReason: cancellationReason,
    }
  );
};
