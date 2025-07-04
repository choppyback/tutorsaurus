const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),

  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

module.exports = function validateLogin(req, res, next) {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  next();
};
