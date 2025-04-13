import { http } from "../config/axios";

export type User = {
  _id: string;
  userName: string;
  email: string;
  password: string;
  address: string | null;
  phone: string | null;
  role: number;
  status: string;
  confirmPassword: string;
  image: string;
  updatedAt: string;
  createdAt: string;
  updatedBy: User;
};

export const registerUser = (data: User) => {
  return http.post("/auth/singup", data);
};

export const loginUser = (data: User) => {
  return http.post("/auth/singin", data);
};

export const getUser = () => {
  return http.get("/auth/user");
};

export const getDetailUser = (userId: string) => {
  return http.get(`/auth/user/${userId}`);
};

// export const updateUser = (userId: string) => {
//   return http.put(`/auth/user/${userId}`);
// };

export const updateStatus = (userId: string, status: string) => {
  return http.put(`auth/user/${userId}`, { status });
};

export const updateRole = (userId: string, role: number) => {
  return http.put(`auth/user/role/${userId}`, { role });
};

export const updateUser = (userId: string, userData: Partial<User>) => {
  return http.put(`/auth/user/update`, {
    _id: userId,
    ...userData,
  });
};
