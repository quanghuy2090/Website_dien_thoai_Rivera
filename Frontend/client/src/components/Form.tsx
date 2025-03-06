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

        {/* Register Fields */}
        {mode === "register" && (
          <>
            <div className="form register">
              <div className="form-content">
                <header>Đăng Ký</header>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                  <div className="field input-field mb-3 col-md-6">
                    <input
                      type="text"
                      placeholder="Tên người dùng"
                      className="input mb-2"
                      {...register("userName", {
                        required: "Không để trống tên",
                        maxLength: {
                          value: 100,
                          message: "Nhiều nhất 100 ký tự"
                        }
                      })}
                    />
                    {errors?.userName && (
                      <span className="text-danger mt-5 ">
                        *{errors.userName.message}
                      </span>
                    )}
                  </div>
                  <div className="field input-field mb-3 col-md-6">
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

                  <div className="field input-field mb-3 col-md-6">
                    <input
                      type="text"
                      placeholder="Số điện thoại"
                      className="input mb-2"
                      {...register("phone", {
                        required: "Không để trống số điện thoại",
                        maxLength: {
                          value: 15,
                          message: "Nhiều nhất 15 ký tự"
                        },
                        minLength: {
                          value: 10,
                          message: "Ít nhất 10 ký tự"
                        }
                      })}
                    />
                    {errors?.phone && (
                      <span className="text-danger mt-5">
                        *{errors.phone.message}
                      </span>
                    )}
                  </div>
                  <div className="field input-field mb-3 col-md-6">
                    <input
                      type="text"
                      placeholder="Địa chỉ"
                      className="input mb-2"
                      {...register("address", {
                        required: "Không để trống địa chỉ",
                        maxLength: {
                          value: 255,
                          message: "Nhiều nhất 255 ký tự"
                        }
                      })}
                    />
                    {errors?.address && (
                      <span className="text-danger mt-5">
                        *{errors.address.message}
                      </span>
                    )}
                  </div>
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
                          message: "Ít nhất 7 ký tự",
                        },
                        maxLength: {
                          value: 255,
                          message: "Nhiều nhất 255 ký tự"
                        }
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
                  <div className="field input-field mb-5">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Xác nhận mật khẩu"
                      className="password mb-2"
                      id=" confirmPassWord"
                      {...register("confirmPassword", {
                        required: "Không để trống xác nhận mật khẩu",
                        validate: (value) =>
                          value === password || "Không trùng khớp mật khẩu",
                      })}
                    />
                    <span
                      className=" eye-icon"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        className={`bx ${showConfirmPassword ? "bx-show" : "bx-hide"}`}
                      />
                    </span>
                    {errors?.confirmPassword && (
                      <span className="text-danger mt-5">
                        *{errors.confirmPassword.message}
                      </span>
                    )}
                  </div>

                  <div className="field button-field">
                    <button>Đăng ký</button>
                  </div>
                </form>
                <div className="form-link">
                  <span>
                    Đã có tài khoản?{" "}
                    <a href="/login" className="link login-link">
                      Đăng nhập
                    </a>
                  </span>
                </div>
              </div>
              <div className="line" />
              <div className="media-options">
                <a href="#" className="field facebook">
                  <i className="bx bxl-facebook facebook-icon" />
                  <span>Đăng nhập với Facebook</span>
                </a>
              </div>
              <div className="media-options">
                <a href="#" className="field google">
                  <img src=".\image\google-icon.webp" className="google-img" />
                  <span>Đăng nhập với Google</span>
                </a>
              </div>
            </div>
          </>
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
                          message: "Ít nhất 7 ký tự",
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
                    <a href="/register" className="link signup-link">
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
                <a href="/register" className="field google">
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
