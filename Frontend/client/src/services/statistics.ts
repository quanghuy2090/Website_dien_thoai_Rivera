import { http } from "../config/axios";

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

export interface Statistics {
  totalRevenue: {
    message: string;
    data: {
      totalRevenue: number;
    };
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
}

export const getStatistics = async (): Promise<Statistics> => {
  const [revenueRes, topUsersRes, topProductsRes, leastSoldProductsRes] =
    await Promise.all([
      getTotalRevenue(),
      getTopUsers(),
      getTopProducts(),
      getLeastSoldProducts(),
    ]);

  return {
    totalRevenue: revenueRes.data,
    topUsers: topUsersRes.data,
    topProducts: topProductsRes.data,
    leastSoldProducts: leastSoldProductsRes.data,
  };
};

export const getTotalRevenue = () => {
  return http.get<{ message: string; data: { totalRevenue: number } }>(
    "/statistics/revenue"
  );
};

export const getTopUsers = () => {
  return http.get<{ message: string; data: TopUser[] }>(
    "/statistics/top-users"
  );
};

export const getTopProducts = () => {
  return http.get<{ message: string; data: TopProduct[] }>(
    "/statistics/top-products"
  );
};

export const getLeastSoldProducts = () => {
  return http.get<{ message: string; data: TopProduct[] }>(
    "/statistics/least-sold-products"
  );
};
