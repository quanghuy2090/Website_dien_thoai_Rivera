import { http } from "../config/axios";

export interface RevenueData {
  _id: {
    year: number;
    month: number;
  };
  totalRevenue: number;
}

export interface TopUser {
  _id: string;
  userName: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
}

export interface TopProduct {
  _id: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
}
export interface OrderStatus {
  status: string;
  totalOrders: number;
  percentage: string;
}

export interface Statistics {
  totalRevenue: {
    message: string;
    data: RevenueData[];
  };
  topUsers: {
    message: string;
    data: TopUser[];
  };
  topProducts: {
    message: string;
    data: TopProduct[];
  };
  leastSoldProducts: {
    message: string;
    data: TopProduct[];
  };
  orderStatus: {
    message: string;
    totalOrders: number;
    data: OrderStatus[];
  };
}

export const getStatistics = async (): Promise<Statistics> => {
  const [revenueRes, topUsersRes, topProductsRes, leastSoldProductsRes, orderStatusRes] = await Promise.all([
    getTotalRevenue(),
    getTopUsers(),
    getTopProducts(),
    getLeastSoldProducts(),
    getOrderStatus(),
  ]);

  return {
    totalRevenue: revenueRes.data,
    topUsers: topUsersRes.data,
    topProducts: topProductsRes.data,
    leastSoldProducts: leastSoldProductsRes.data,
    orderStatus: orderStatusRes.data,
  };
};

export const getTotalRevenue = () => {
  return http.get<{ message: string; data: RevenueData[] }>("/statistics/revenue");
};

export const getTopUsers = () => {
  return http.get<{ message: string; data: TopUser[] }>("/statistics/top-users");
};

export const getTopProducts = () => {
  return http.get<{ message: string; data: TopProduct[] }>("/statistics/top-products");
};

export const getLeastSoldProducts = () => {
  return http.get<{ message: string; data: TopProduct[] }>("/statistics/least-sold-products");
};
export const getOrderStatus = () => {
  return http.get<{ message: string; totalOrders: number; data: OrderStatus[] }>("/statistics/order-status");
};