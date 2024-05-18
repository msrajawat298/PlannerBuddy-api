import Joi from 'joi';

const userUpdateValidation = (req, res, next) => {
  // Define validation schema
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(30),
    password: Joi.string().min(8),
    phoneNumber: Joi.string().regex(/^\d{10}$/).messages({'string.pattern.base': 'Phone number must have 10 digits.'}),
    address: Joi.string().min(3)
  });

  // Validate data against schema
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({error: true, message: error.details[0].message });
  return next();
};

const changePasswordValidation = (req, res, next) => {
  // Define validation schema
  const schema = Joi.object({
    oldPassword: Joi.string().min(8).required(),
    password: Joi.string().min(8).required()
  });

  // Validate data against schema
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({error: true, message: error.details[0].message });
  return next();
};

const forgetPasswordValidation = (req, res, next) => {
  // Define validation schema
  const schema = Joi.object({
    email: Joi.string().email().required()
  });

  // Validate data against schema
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({error: true, message: error.details[0].message });
  return next();
};

const verifyOtpValidation = (req, res, next) => {
  // Define validation schema
  const schema = Joi.object({
    otp: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  });

  // Validate data against schema
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({error: true, message: error.details[0].message });
  return next();
};

const validate = { userUpdateValidation, changePasswordValidation, forgetPasswordValidation, verifyOtpValidation };

export default validate;
