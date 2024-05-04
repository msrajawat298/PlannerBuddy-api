import Joi from 'joi';

const GuestValidation = (isUpdate = false) => (req, res, next) => {
  // Define validation schema
  let schema = Joi.object({
    name: isUpdate ? Joi.string().min(3).max(30).required() : Joi.string().min(3).max(30),
    phoneNumber: isUpdate ? Joi.string().regex(/^\d{10}$/).messages({'string.pattern.base': 'Phone number must have 10 digits.'}).required() : Joi.string().regex(/^\d{10}$/).messages({'string.pattern.base': 'Phone number must have 10 digits.'}),
    email: Joi.string().email(),
    address: Joi.string().min(3).max(100)
  });
  if (!isUpdate) {
    schema = schema.or('name', 'phoneNumber', 'email', 'address');
  }

  // Validate data against schema
  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send({error: true, message: error.details[0].message });
  return next();
};

export default GuestValidation;