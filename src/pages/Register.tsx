// import React from "react";
import { AuthForm } from "../components/Form";
import { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { registerUser, User } from "../services/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const nav = useNavigate();
  const handleRegister: SubmitHandler<User> = (values) => {
    registerUser(values)
      .then(() => {
        alert("Dang ky thanh cong");
        nav("/login");
      })
      .catch((error) => {
        toast.error("Error: " + error.message);
      });
  };
  return (
    <div>
      <h4>Register</h4>
      <AuthForm onSubmit={handleRegister} />
    </div>
  );
};

export default Register;
