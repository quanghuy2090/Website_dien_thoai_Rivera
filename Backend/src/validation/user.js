import Joi from "joi";

export const singUpValidate = Joi.object({
  userName: Joi.string().max(100).trim().required().messages({
    "any.required": "Tên không được để trống.",
    "string.max": "Tên tối đa là 100 ký tự.",
  }),
  email: Joi.string().email().trim().lowercase().required().messages({
    "any.required": "Email không được để trống.",
    "string.email": "Email không đúng định dạng.",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .allow(null)
    .messages({
      "string.pattern.base": "Số điện thoại phải từ 10 đến 15 số.",
    }),
  address: Joi.string().max(255).trim().allow(null).messages({
    "string.max": "Địa chỉ tối đa 255 ký tự.",
  }),
  password: Joi.string().min(7).required().messages({
    "any.required": "Mật khẩu là bắt buộc.",
    "string.min": "Mật khẩu tối thiểu 7 ký tự.",
  }),
  confirmPassword: Joi.string()
    .required()
    .min(7)
    .max(255)
    .valid(Joi.ref("password"))
    .messages({
      "any.required": "Xác nhận mật khẩu là bắt buộc.",
      "string.min": "Xác nhận mật khẩu phải có ít nhất 7 ký tự.",
      "string.max": "Xác nhận mật khẩu ít hơn 255 ký tự.",
      "any.only": "Xác nhận mật khẩu không khớp với mật khẩu.",
    }),
  status: Joi.string().valid("active", "banned").default("active"),
  role: Joi.number().valid(1, 2, 3).default(3),
});

export const singInValidate = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "any.required": "Email không được để trống.",
    "string.email": "Email không đúng định dạng.",
  }),
  password: Joi.string().min(7).required().messages({
    "any.required": "Mật khẩu là bắt buộc.",
    "string.min": "Mật khẩu tối thiểu 7 ký tự.",
  }),
});
