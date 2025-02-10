// import React from "react";
import { AuthForm } from "../components/Form";
import { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { registerUser, User } from "../services/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  
  return (
    <div>
      <h4>Register</h4>
      <AuthForm onSubmit={handleRegister} />
    </div>
  );
};

export default Register;
