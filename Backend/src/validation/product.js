import Joi from "joi";

// Validation cho từng variant
const variantValidation = Joi.object({
  color: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": "Màu sắc phải là một chuỗi ký tự.",
      "string.empty": "Màu sắc không được để trống.",
      "any.required": "Màu sắc là bắt buộc.",
    }),
  capacity: Joi.string()
    .trim()
    .allow("") // Cho phép để trống nếu không có dung lượng
    .messages({
      "string.base": "Dung lượng phải là một chuỗi ký tự.",
    }),
  price: Joi.number()
    .min(1)
    .required()
    .messages({
      "any.required": "Giá sản phẩm là bắt buộc.",
      "number.min": "Giá sản phẩm không thể nhỏ hơn 1.",
      "number.base": "Giá sản phẩm phải là số.",
    }),
  stock: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "Stock phải là một số.",
      "number.min": "Stock không được nhỏ hơn 0.",
      "any.required": "Trường stock là bắt buộc.",
    }),
  sku: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": "SKU phải là một chuỗi ký tự.",
      "string.empty": "SKU không được để trống.",
      "any.required": "SKU là bắt buộc.",
    }),
});

// Validation cho sản phẩm
export const productValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      "any.required": "Tên sản phẩm là bắt buộc.",
      "string.empty": "Tên sản phẩm không được để trống.",
      "string.min": "Tên sản phẩm phải có ít nhất 3 ký tự.",
      "string.max": "Tên sản phẩm phải nhỏ hơn 255 ký tự.",
    }),
  images: Joi.array()
    .items(Joi.string().uri().messages({
      "string.uri": "Mỗi ảnh phải là một URL hợp lệ.",
    }))
    .min(1)
    .required()
    .messages({
      "array.min": "Phải có ít nhất một ảnh.",
      "any.required": "Trường images là bắt buộc.",
    }),
  short_description: Joi.string()
    .allow("") // Cho phép để trống
    .messages({
      "string.base": "Mô tả ngắn phải là một chuỗi ký tự.",
    }),
  long_description: Joi.string()
    .allow("") // Cho phép để trống
    .messages({
      "string.base": "Mô tả dài phải là một chuỗi ký tự.",
    }),
  status: Joi.string()
    .valid("active", "banned")
    .default("active")
    .messages({
      "any.only": 'Status chỉ có thể là "active" hoặc "banned".',
    }),
  is_hot: Joi.string()
    .valid("yes", "no")
    .default("no")
    .messages({
      "any.only": 'Trường is_hot chỉ có thể là "yes" hoặc "no".',
    }),
  variants: Joi.array()
    .items(variantValidation)
    .min(1)
    .required()
    .messages({
      "array.min": "Phải có ít nhất một biến thể.",
      "any.required": "Trường variants là bắt buộc.",
    }),
  categoryId: Joi.string()
    .required()
    .messages({
      "any.required": "CategoryId là bắt buộc.",
      "string.empty": "CategoryId không được để trống.",
    }),
});