import { AuthForm } from "../../components/Form";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { registerUser, User } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import "../../css/auth.css";

const Register = () => {
  const nav = useNavigate();

  const showToast = (message: string, type: "success" | "error") => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleRegister: SubmitHandler<User> = async (values) => {
    try {
      await registerUser(values);
      showToast("Đăng ký thành công", "success");
      nav("/login");
    } catch (error: any) {
      // Xử lý lỗi backend trả về
      if (error.response) {
        const { message } = error.response.data;
        if (Array.isArray(message)) {
          // Trường hợp Joi trả về nhiều lỗi
          message.forEach((err: string) => showToast(err, "error"));
        } else {
          // Trường hợp email đã tồn tại hoặc lỗi khác
          showToast(message, "error");
        }
      } else {
        showToast("Đã xảy ra lỗi không xác định", "error");
      }
    }
  };
  return (
    <div className="body-auth">
      <AuthForm onSubmit={handleRegister} mode="register" />
    </div>
  );
};

export default Register;
