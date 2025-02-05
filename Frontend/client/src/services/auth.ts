import { http } from "../config/axios";

export type User = {
  userName:string
  email: string;
  password: string;
  address: string;
  phone: string;
  confirmPassword:string
};

export const registerUser = (data: User) => {
  console.log(data)
  return http.post("/auth/singup", data);
};

export const loginUser = (data: User) => {
  return http.post("/auth/singin", data);
};
