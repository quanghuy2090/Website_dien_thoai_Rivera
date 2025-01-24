import Joi from "joi";

export const productValidation = Joi.object({
  name: Joi.string().required().min(3).max(255),
  price: Joi.number().required(),
  description: Joi.string(),
  image: Joi.string(),
  categoryId: Joi.string().required(),
});
