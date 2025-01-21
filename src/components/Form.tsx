import { useForm } from "react-hook-form";
import { User } from "../services/auth";

type Form = {
  onSubmit: (values: User) => void;
};

export function AuthForm({ onSubmit }: Form) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email 
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            {...register("email", {
              required: "khong de trong",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "phai dung dinh dang cua Email",
              },
            })}
          />
          {errors?.email && <span>{errors.email.message}</span>}
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            {...register("password", { required: "khong de trong" })}
          />
          {errors?.password && <span>{errors.password.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
}
