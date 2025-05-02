import { http } from "../config/axios";
import { User } from "./auth";
import { CartItem, Carts } from "./cart";

export interface IShippingAddress {
  userName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  salePrice: number;
  color: string;
  capacity: string;
  productName: string;
  productImage: string;
  shortDescription?: string;
  variant: {
    color: string;
    capacity: string;
    price: number;
    salePrice: number;
    stock: number;
    sku: string;
  };
}

export interface Order {
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    userName: string;
    phone: string;
    street: string;
    ward: string;
    district: string;
    city: string;
  };
  status:
    | "Chưa xác nhận"
    | "Đã xác nhận"
    | "Đang giao hàng"
    | "Đã giao hàng"
    | "Đã nhận hàng"
    | "Hoàn thành"
    | "Đã hủy";
  paymentMethod: "COD" | "Online";
  paymentStatus: "Chưa thanh toán" | "Đã thanh toán" | "Không đạt";
  cancelReason?: string;
  cancelledBy?: string;
  cancelHistory?: {
    cancelledAt: Date;
    cancelReason: string;
    cancelledBy: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
  completedAt?: Date;
}

export interface OrderResponse {
  message: string;
  order?: Order;
  orders?: Order[];
  data?: Order[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

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

// Tạo đơn hàng COD
export const createOrderCOD = (shippingAddress: IShippingAddress) => {
  return http.post<OrderResponse>("/order/cod", { shippingAddress });
};

// Tạo đơn hàng Online
export const createOrderOnline = (shippingAddress: IShippingAddress) => {
  return http.post<OrderResponse>("/order/online", { shippingAddress });
};

// Lấy tất cả đơn hàng
export const getAllOrder = () => {
  return http.get<OrderResponse>("/order");
};

// Lấy đơn hàng theo ID
export const getOrderById = (id: string) => {
  return http.get<OrderResponse>(`/order/${id}`);
};

// Tìm kiếm đơn hàng
export const searchOrders = (orderId?: string, userName?: string) => {
  return http.get<OrderResponse>("/order/search", {
    params: { orderId, userName },
  });
};

// Lọc đơn hàng theo trạng thái
export const filterOrders = (status: string | string[]) => {
  return http.get<OrderResponse>("/order/filter", {
    params: { status },
  });
};

// Cập nhật trạng thái đơn hàng bởi admin
export const updateOrderStatusByAdmin = (
  id: string,
  status: Order["status"],
  cancelReason?: string
) => {
  return http.put<OrderResponse>(`/order/admin/status/${id}`, {
    status,
    cancelReason,
  });
};

// Cập nhật trạng thái đơn hàng bởi khách hàng
export const updateOrderStatusByCustomer = (
  id: string,
  status: "Đã nhận hàng" | "Đã hủy",
  cancelReason?: string
) => {
  return http.put<OrderResponse>(`/order/customer/status/${id}`, {
    status,
    cancelReason,
  });
};

// Lấy danh sách đơn hàng đã hủy (admin)
export const getCancelledOrdersByAdmin = (
  page: number = 1,
  limit: number = 10
) => {
  return http.get<OrderResponse>("/order/cancelled/admin", {
    params: { page, limit },
  });
};

// Lấy danh sách đơn hàng đã hủy (khách hàng)
export const getCancelledOrdersByCustomer = (
  page: number = 1,
  limit: number = 10
) => {
  return http.get<OrderResponse>("/order/cancelled/customer", {
    params: { page, limit },
  });
};
