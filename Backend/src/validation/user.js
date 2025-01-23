import Joi from "joi";

export const singUpValidate = Joi.object({
  userName: Joi.string().required().min(6).max(255).message({
    "string.empty": "userName khong duoc de trong",
    "any.required": "userName la bat buoc",
    "string.min": "userName phai co it nhat {#litmit} ky tu",
    "string.max": "userName it hon {#litmit} ky tu",
  }),
  email: Joi.string().required().email().message({
    "string.empty": "Email khong duoc de trong",
    "any.required": "Email la bat buoc",
    "string.email": "Email khong dung dinh dang",
  }),
  password: Joi.string().required().min(6).max(255).message({
    "string.empty": "Password khong duoc de trong",
    "any.required": "Password la bat buoc",
    "string.min": "Password phai co it nhat {#litmit} ky tu",
    "string.max": "Password it hon {#litmit} ky tu",
  }),
  confirmPassword: Joi.string()
    .required()
    .min(6)
    .max(255)
    .valid(Joi.ref("password"))
    .messages({
      "string.empty": "confirmPassword khong duoc de trong",
      "any.required": "confirmPassword la bat buoc",
      "string.min": "confirmPassword phai co it nhat {#litmit} ky tu",
      "string.max": "confirmPassword it hon {#litmit} ky tu",
      "any.only": "confirmPassword khong khop voi Password",
    }),
  role: Joi.string(),
});

export const singInValidate = Joi.object({
  email: Joi.string().required().email().message({
    "string.empty": "Email khong duoc de trong",
    "any.required": "Email la bat buoc",
    "string.email": "Email khong dung dinh dang",
  }),
  password: Joi.string().required().min(6).max(255).message({
    "string.empty": "Password khong duoc de trong",
    "any.required": "Password la bat buoc",
    "string.min": "Password phai co it nhat {#litmit} ky tu",
    "string.max": "Password it hon {#litmit} ky tu",
  }),
});
