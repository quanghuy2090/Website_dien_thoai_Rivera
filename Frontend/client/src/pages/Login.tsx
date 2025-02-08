// import React from "react";
import { AuthForm } from "../components/Form";
import { SubmitHandler } from "react-hook-form";
import {toast} from "react-hot-toast";
import { loginUser, User } from "../services/auth";
import { useNavigate } from "react-router-dom";

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
      .catch((error) => {
        toast.error("Error: " + error.message);
      });
  };
  return (
    <div>
      <h4>Login</h4>
     <AuthForm onSubmit={handleLogin} mode="login" />
    </div>
  );
};

export default Login;
