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
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Username Field - Only for Registration */}
        {mode === "register" && (
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              {...register("userName", {
                required: "Username is required",
              })}
            />
            {errors?.userName && <span>{errors.userName.message}</span>}
            <div className="mb-3">
              <label htmlFor="text" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                {...register("address", {
                  required: "Address is required",
                })}
              />
              {errors?.password && <span>{errors.address?.message}</span>}
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                {...register("phone", {
                  required: "Phone is required",
                })}
              />
              {errors?.password && <span>{errors.phone?.message}</span>}
            </div>
          </div>


        )}
        {/* Email Field */}
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
          {errors?.email && <span>{errors.email.message}</span>}
        </div>

        {/* Password Field */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors?.password && <span>{errors.password.message}</span>}
        </div>



        {/* Confirm Password Field - Only for Registration */}
        {mode === "register" && (
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
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
              <span>{errors.confirmPassword.message}</span>
            )}
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </>
  );
}
