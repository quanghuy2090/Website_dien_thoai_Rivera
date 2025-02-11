import { http } from "../config/axios";

export type User = {
  _id: string;
  userName:string
  email: string;
  password: string;
  address: string;
  phone: string;
  role: string;
  confirmPassword: string;
};

export const registerUser = (data: User) => {
  console.log(data)
  return http.post("/auth/singup", data);
};

export const loginUser = (data: User) => {
  return http.post("/auth/singin", data);
};

export const getUser = () => {
  return http.get("/auth/user");
};

export const deleteUser = (_id: string) => {
  return http.delete(`/auth/user/${_id}`);
}
