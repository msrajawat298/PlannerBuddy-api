import Joi from 'joi';

const userUpdateValidation = (req, res, next) => {
  // Define validation schema
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(30),
    password: Joi.string().min(8),
    phoneNumber: Joi.string().regex(/^\d{10}$/).messages({'string.pattern.base': 'Phone number must have 10 digits.'})
  });

  // Validate data against schema
  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send({error: true, message: error.details[0].message });
  return next();
};

const validate = { userUpdateValidation };

export default validate;
