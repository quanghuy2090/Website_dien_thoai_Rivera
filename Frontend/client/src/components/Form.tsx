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
                <header>Đăng Nhập</header>
                <form onSubmit={handleSubmit(onSubmit)}>


                <div className="field input-field mb-8">
                    <input
                      type="text"
                      placeholder="Username"
                      className="input mb-2"
                      {...register("userName", {
                        required: "Không để trống tên",
                      
                      })}
                    />
                    {errors?.userName && (
                      <span className="text-danger mt-8">
                        *{errors.userName.message}
                      </span>
                    )}
                  </div>





                  <div className="field input-field mb-8">
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

                  <div className="field input-field mb-8">
                    <input
                      type="text"
                      placeholder="Phone"
                      className="input mb-2"
                      {...register("phone", {
                        required: "Không để trống số điện thoại",
                       
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
                  

                  <div className="field input-field mb-8">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="confirm password"
                      className="password mb-2" id=" confirmPassWord"
                      {...register("confirmPassword", {
                        required: "Không để trống mật khẩu",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                        
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



                  
                  <div className="field button-field">
                    <button>Đăng nhập</button>
                  </div>
                </form>
                <div className="form-link">
                  <span>
                    Already have an account ?{" "}
                    <a href="/login" className="link signup-link">
                      Đăng ký
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