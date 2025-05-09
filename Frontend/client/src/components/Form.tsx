import { useForm } from "react-hook-form";
import { User } from "../services/auth";
import { useState } from "react";
import "../css/auth.css";
import { useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

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
  const nav = useNavigate();
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;

    try {
      const res = await fetch("http://localhost:3000/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });

      const data = await res.json();

      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem(`user`, JSON.stringify(data.data.user));
      nav("/");
      console.log("Login success", data);
    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <>
      <section className="container-auth forms">
        <div className="overlay"></div>
        {/* Username Field - Only for Registration */}

        {/* Register Fields */}
        {mode === "register" && (
          <>
            <div className="form-auth register">
              <div className="form-auth-content">
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
                            message: "Nhiều nhất 100 ký tự",
                          },
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
                          message: "Nhiều nhất 255 ký tự",
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
                        className={`bx ${
                          showConfirmPassword ? "bx-show" : "bx-hide"
                        }`}
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
                <div className="form-auth-link">
                  <span>
                    Đã có tài khoản?{" "}
                    <a href="/login" className="link login-link">
                      Đăng nhập
                    </a>
                  </span>
                </div>
              </div>
              <div className="line" />
              {/* <div className="media-options">
                <a href="#" className="field facebook">
                  <i className="bx bxl-facebook facebook-icon" />
                  <span>Đăng nhập với Facebook</span>
                </a>
              </div> */}
              <div className="media-options">
                <a href="#" className="field google">
                  <img src=".\image\google-icon.webp" className="google-img" />
                  <span>Đăng nhập với Google</span>
                </a>
              </div>
              <div className="form-auth-link mt-4">
                <a
                  href="/"
                  className="link login-link"
                  style={{ fontSize: 18 }}
                >
                  Về trang chủ
                </a>
              </div>
            </div>
          </>
        )}

        {/* Login Fields */}
        {mode === "login" && (
          <>
            <div className="form-auth login">
              <div className="form-auth-content">
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
                  <div className="form-auth-link">
                    <a href="#" className="forgot-pass">
                      Quên mật khẩu?
                    </a>
                  </div>
                  <div className="field button-field">
                    <button>Đăng nhập</button>
                  </div>
                </form>
                <div className="form-auth-link">
                  <span>
                    Chưa có tài khoản?{" "}
                    <a href="/register" className="link signup-link">
                      Đăng ký
                    </a>
                  </span>
                </div>
              </div>
              <div className="line" />
              {/* <div className="media-options">
                <a href="#" className="field facebook">
                  <i className="bx bxl-facebook facebook-icon" />
                  <span>Đăng nhập với Facebook</span>
                </a>
              </div> */}
              <div className="media-options">
                <a href="#" className="field google">
                  {/* <img src=".\image\google-icon.webp" className="google-img" /> */}
                  <GoogleLogin onSuccess={handleSuccess} />
                </a>
              </div>

              <div className="form-auth-link mt-4">
                <a
                  href="/"
                  className="link login-link"
                  style={{ fontSize: 18 }}
                >
                  Về trang chủ
                </a>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
