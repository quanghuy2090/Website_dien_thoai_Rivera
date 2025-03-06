import { useForm } from "react-hook-form";
import { User } from "../services/auth";
import { useState } from "react";

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

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Watch password value for confirming password match
  const password = watch("password");

  return (
    <>
      <section className="container forms">
        <div className="overlay"></div>
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
                <span className="text-danger">*{errors.userName.message}</span>
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
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <span
                  className="input-group-text eye-icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                >
                  <i className={`bx ${showPassword ? "bx-show" : "bx-hide"}`} />
                </span>
              </div>
              {errors?.password && (
                <span className="text-danger">*{errors.password.message}</span>
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
                <span className="text-danger">*{errors.address.message}</span>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="confirmPassword" className="form-label">
                Xác nhận mật khẩu
              </label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <span
                  className="input-group-text eye-icon"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                >
                  <i
                    className={`bx ${
                      showConfirmPassword ? "bx-show" : "bx-hide"
                    }`}
                  />
                </span>
              </div>
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
                className="text-primary text-decoration-none ms-1 link"
              >
                Đăng nhập ngay
              </a>
            </span>
          </div>
        )}

        {/* Login Fields */}
        {mode === "login" && (
          <>
            <div className="form login">
              <div className="form-content">
                <header>Đăng nhập</header>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="field input-field mb-5">
                    <input
                      type="email"
                      placeholder="Email"
                      className="input mb-2"
                      {...register("email", {
                        required: "Không để trống Email",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: "Không đúng định dạng Email",
                        },
                      })}
                    />
                    {errors?.email && (
                      <span className="text-danger mt-5">
                        *{errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="field input-field mb-5">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu"
                      className="password mb-2"
                      {...register("password", {
                        required: "Không để trống mật khẩu",
                        minLength: {
                          value: 7,
                          message: "Yêu cầu ít nhất 7 ký tự"
                        },
                      })}
                    />
                    <span
                      className=" eye-icon"
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        className={`bx ${showPassword ? "bx-show" : "bx-hide"}`}
                      />
                    </span>
                    {errors?.password && (
                      <span className="text-danger mt-5">
                        *{errors.password.message}
                      </span>
                    )}
                  </div>
                  <div className="form-link">
                    <a href="#" className="forgot-pass">
                      Forgot password?
                    </a>
                  </div>
                  <div className="field button-field">
                    <button>Login</button>
                  </div>
                </form>
                <div className="form-link">
                  <span>
                    Don't have an account?{" "}
                    <a href="#" className="link signup-link">
                      Signup
                    </a>
                  </span>
                </div>
              </div>
              <div className="line" />
              <div className="media-options">
                <a href="#" className="field facebook">
                  <i className="bx bxl-facebook facebook-icon" />
                  <span>Login with Facebook</span>
                </a>
              </div>
              <div className="media-options">
                <a href="#" className="field google">
                  <img src=".\image\google-icon.webp" className="google-img" />
                  <span>Login with Google</span>
                </a>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
