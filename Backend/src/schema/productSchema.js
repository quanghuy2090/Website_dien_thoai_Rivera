import Joi from "joi";

// Định nghĩa schema Joi cho sản phẩm
const productValidationSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Tên sản phẩm không được để trống.",
        "any.required": "Tên sản phẩm là bắt buộc.",
    }),
    price: Joi.number().positive().required().messages({
        "number.base": "Giá phải là số.",
        "number.positive": "Giá phải lớn hơn 0.",
        "any.required": "Giá là bắt buộc.",
    }),
    brand: Joi.string().required().messages({
        "string.empty": "Thương hiệu không được để trống.",
        "any.required": "Thương hiệu là bắt buộc.",
    }),
    releaseDate: Joi.date().optional().messages({
        "date.base": "Ngày ra mắt phải là ngày hợp lệ.",
    }),
    discount: Joi.number().min(0).max(100).optional().messages({
        "number.min": "Giảm giá phải lớn hơn hoặc bằng 0.",
        "number.max": "Giảm giá phải nhỏ hơn hoặc bằng 100%.",
    }),
    stock: Joi.number().integer().min(0).required().messages({
        "number.base": "Số lượng tồn kho phải là số.",
        "number.integer": "Số lượng tồn kho phải là số nguyên.",
        "number.min": "Số lượng tồn kho phải lớn hơn hoặc bằng 0.",
        "any.required": "Số lượng tồn kho là bắt buộc.",
    }),
    image: Joi.string().uri().required().messages({
        "string.empty": "URL hình ảnh là bắt buộc.",
        "string.uri": "Hình ảnh phải là URL hợp lệ.",
    }),
    description: Joi.string().required().messages({
        "string.empty": "Mô tả không được để trống.",
        "any.required": "Mô tả là bắt buộc.",
    }),
});

export default productValidationSchema;
