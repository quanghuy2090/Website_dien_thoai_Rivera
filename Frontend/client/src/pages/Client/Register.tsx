import { useEffect, useState } from "react";
import { AuthForm } from "../../components/Form";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { getUser, registerUser, User } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import "../../css/auth.css";

const Register = () => {
  const [existingUsers, setExistingUsers] = useState<User[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getUser();
        setExistingUsers(res.data.data);
      } catch (error) {
        toast.error("Error fetching users: " + error);
      }
    })();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleRegister: SubmitHandler<User> = async (values) => {
    const duplicateUser = existingUsers.find(
      (user) => user.userName === values.userName || user.email === values.email
    );

    if (duplicateUser) {
      if (duplicateUser.userName === values.userName) {
        showToast("Tên người dùng đã tồn tại", "error");
      }
      if (duplicateUser.email === values.email) {
        showToast("Email đã tồn tại", "error");
      }
      return;
    }

    try {
      await registerUser(values);
      showToast("Đăng ký thành công", "success");
      nav("/login");
    } catch (error) {
      showToast("Lỗi: " + error.message, "error");
    }
  };

  return (
    <div className="body-auth">
      <AuthForm onSubmit={handleRegister} mode="register" />
    </div>
  );
};

export default Register;
