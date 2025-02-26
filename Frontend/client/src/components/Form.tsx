import { useForm } from "react-hook-form";
import { User } from "../services/auth";

type FormProps = {
  onSubmit: (values: User) => void;
  mode: "login" | "register"; // Determines form type
};

export function AuthForm({ onSubmit, mode }: FormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<User>();

  // Watch password value for confirming password match
  const password = watch("password");

  return (
    <>
      <div className="body-form">
        <div className="container-form">
          <h4 className="text-center mt-3">
            {mode === "register" ? "Đăng ký" : "Đăng nhập"}
          </h4>
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Username Field - Only for Registration */}
            {mode === "register" && (
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="username" className="form-label">
                    Tên người dùng
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    {...register("userName", {
                      required: "Username is required",
                    })}
                  />
                  {errors?.userName && (
                    <span className="text-danger">
                      *{errors.userName.message}
                    </span>
                  )}
                </div>
                {/* Email Field */}
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "Invalid email format",
                      },
                    })}
                  />
                  {errors?.email && (
                    <span className="text-danger">*{errors.email.message}</span>
                  )}
                </div>
              </div>
            )}

            {/* Phone Field - Only for Registration */}
            {mode === "register" && (
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    {...register("phone", {
                      required: "Phone is required",
                    })}
                  />
                  {errors?.phone && (
                    <span className="text-danger">*{errors.phone.message}</span>
                  )}
                </div>
                {/* Password Field */}
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors?.password && (
                    <span className="text-danger">
                      *{errors.password.message}
                    </span>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="address" className="form-label">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    {...register("address", {
                      required: "Address is required",
                    })}
                  />
                  {errors?.address && (
                    <span className="text-danger">
                      *{errors.address.message}
                    </span>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="confirmPassword" className="form-label">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />
                  {errors?.confirmPassword && (
                    <span className="text-danger">
                      *{errors.confirmPassword.message}
                    </span>
                  )}
                </div>
                <span className="">
                  Bạn đã có tài khoản?
                  <a
                    href="/login"
                    className="text-primary text-decoration-none ms-1"
                  >
                    Đăng nhập ngay
                  </a>
                </span>
              </div>
            )}

            {/* Login Fields */}
            {mode === "login" && (
              <>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "Invalid email format",
                      },
                    })}
                  />
                  {errors?.email && (
                    <span className="text-danger">*{errors.email.message}</span>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors?.password && (
                    <span className="text-danger">
                      *{errors.password.message}
                    </span>
                  )}
                </div>
                <span className="login">
                  Bạn chưa có tài khoản?
                  <a
                    href="/register"
                    className="text-primary text-decoration-none ms-1"
                  >
                    Đăng ký ngay
                  </a>
                </span>
              </>
            )}

            {/* Button Section */}
            <div className="d-flex justify-content-between mt-3">
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{ width: 170 }}
              >
                {mode === "login" ? "Đăng nhập" : "Đăng ký"}
              </button>
              <button
                className="btn btn-primary text-white"
                style={{ width: 170 }}
              >
                Về trang chủ
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
