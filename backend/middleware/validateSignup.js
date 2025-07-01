const Joi = require("joi");

const signupSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),

  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),

  role: Joi.string().valid("student", "tutor", "admin").required().messages({
    "any.only": "Role must be student, tutor, or admin",
    "any.required": "Role is required",
  }),

  faculty: Joi.string().required().messages({
    "any.required": "Faculty is required",
  }),

  gender: Joi.string().required().messages({
    "any.required": "Gender is required",
  }),

  year_of_study: Joi.number().required().messages({
    "any.required": "Year of study is required",
  }),

  modules_taught: Joi.when("role", {
    is: "tutor",
    then: Joi.string().required().messages({
      "any.required": "Modules taught are required for tutors",
    }),
    otherwise: Joi.optional(),
  }),

  hourly_rate: Joi.when("role", {
    is: "tutor",
    then: Joi.number().min(0).max(200).required().messages({
      "number.base": "Hourly rate must be a number",
      "any.required": "Hourly rate is required for tutors",
    }),
    otherwise: Joi.optional(),
  }),

  availability: Joi.string().when("role", {
    is: "tutor",
    then: Joi.string()
      .required()
      .custom((value, helpers) => {
        try {
          const parsed = JSON.parse(value);
          const hasAtLeastOne = Object.values(parsed).some(
            (slot) => slot.enabled && slot.start && slot.end
          );

          if (!hasAtLeastOne) {
            return helpers.message(
              "At least one availability slot must be filled in"
            );
          }

          return value;
        } catch (e) {
          return helpers.message("Availability must be a valid JSON string");
        }
      }),
    otherwise: Joi.optional(),
  }),
});

module.exports = function validateSignup(req, res, next) {
  const { error } = signupSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  next();
};
