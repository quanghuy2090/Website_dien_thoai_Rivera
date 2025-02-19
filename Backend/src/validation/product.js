import Joi from "joi";

export const productValidation = Joi.object({

  name: Joi.string().required().min(3).max(255),
  price: Joi.number().required(),
  description: Joi.string(),
  images: Joi.array().items(Joi.string()).required(),
  name: Joi.string().required().min(3).max(255).message({
    "any.require": "Tên sản phẩm là bắt buộc",
    "string.empty": "Tên sản phẩm không được để trống",
    "stirng.min": "Tên sản phẩm phải có ít nhất 3 kí tự",
    "string.max": "Tên sản phẩm phải nhỏ hơn 255 kí tự",
  }),
  price: Joi.number().required().min(1).message({
    "any.require": "Giá sản phẩm là bắt buộc",
    "number.min": "Giá sản phẩm không thể nhỏ hơn 1",
    "number.base": "Giá sản phẩm phải là số",
  }),
  description: Joi.string().optional(),
  images: Joi.array().items(Joi.string()).required(),
  status: Joi.string().valid("active", "banned").default("active").messages({
    "any.only": 'Status chỉ có thể là "active" hoặc "banned".',
  }),

  is_hot: Joi.string().valid("yes", "no").default("no").messages({
    "any.only": 'Trường is_hot chỉ có thể là "yes" hoặc "no".',
  }),

  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock phải là một số.",
    "number.min": "Stock không được nhỏ hơn 0.",
    "any.required": "Trường stock là bắt buộc.",
  }),

  color: Joi.string().trim().messages({
    "string.base": "Màu sắc phải là một chuỗi ký tự.",
    "string.empty": "Trường color không được để trống.",
  }),

  categoryId: Joi.string().required(),
});
