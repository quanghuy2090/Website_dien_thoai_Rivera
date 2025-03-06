// import React from "react";

import { SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { AuthForm } from "../../components/Form";
import { loginUser, User } from "../../services/auth";

const Login = () => {
  const nav = useNavigate();
  const handleLogin: SubmitHandler<User> = (values) => {
    loginUser(values)
      .then(({ data }) => {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem(`user`, JSON.stringify(data.user));
        toast.success("Dang nhap thanh cong");
        nav("/");
      })
      .catch((err) => {
        // toast.error("Error: " + err.message);
        const error = err as AxiosError;
        if (error.response && error.response.status === 403) {
          // Kiểm tra HTTP status 403
          toast.error("Tài khoản của bạn đã bị vô hiệu hóa ");
        } else {
          toast.error(
            "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu"
          );
        }
      });
  };
  return (
    <div >
      <AuthForm onSubmit={handleLogin} mode="login" />
    </div>
  );
};

export default Login;
