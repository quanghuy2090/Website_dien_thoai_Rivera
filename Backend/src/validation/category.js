import Joi from "joi";

export const categoryValidation = Joi.object({
  name: Joi.string().required().min(3).max(255).trim().messages({
    "string.base": `"Name" phải là một chuỗi ký tự`,
    "string.empty": `"Name" không được để trống`,
    "string.min": `"Name" phải có ít nhất {#limit} ký tự`,
    "string.max": `"Name" không được vượt quá {#limit} ký tự`,
    "any.required": `"Name" là trường bắt buộc`,
  }),
});
