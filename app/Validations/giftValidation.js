import Joi from 'joi';

const giftValidation = (req, res, next) => {
  const schema = Joi.object({
    eventId: Joi.number().required(),
    guestId: Joi.number().allow(null),
    guestInfo: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().required(),
      address: Joi.string().required()
    }).when('guestId', { is: null, then: Joi.required() }),
    amount: Joi.string(),
    note: Joi.string(),
    isYourGift: Joi.string().valid('yes', 'no').default('yes')
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  return next();
};

const validate = {
  giftValidation
};

export default validate;