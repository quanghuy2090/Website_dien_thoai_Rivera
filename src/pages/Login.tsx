// import React from "react";
import { AuthForm } from "../components/Form";
import { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { loginUser, User } from "../services/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const nav = useNavigate();
  const handleLogin: SubmitHandler<User> = (values) => {
    loginUser(values)
      .then(({ data }) => {
        localStorage.setItem("token",  data.accessToken);
        alert("đăng nhập thành công ");
        nav("/");
      })
      .catch((error) => {
        toast.error("Error: " + error.message);
      });
  };
  return (
    <div>git
      <h4>Login</h4>
      <AuthForm onSubmit={handleLogin} />
    </div>
  );
};

export default Register;
