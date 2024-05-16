import Joi from 'joi';

const addEventValidation = (req, res, next) => {
  // Define validation schema
  const schema = Joi.object({
    eventName: Joi.string().min(3).max(30).required(),
    eventDate: Joi.date().iso().required(),
    eventTime: Joi.string()
      .regex(/^\d{2}:\d{2}$/),
    eventLocation: Joi.string().required(),
    isYourEvent: Joi.string().valid('yes', 'no').default('yes'),
    guestId: Joi.number().allow(null).when('isYourEvent', { is: 'no', then: Joi.required() })
  });

  // Validate data against schema
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  return next();

};

const validate = {
  addEventValidation
};
export default validate;
