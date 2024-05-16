import Joi from 'joi';

const giftValidation = (req, res, next) => {
  const schema = Joi.object({
    eventId: Joi.number().required(),
    guestId: Joi.number().required()
  });

  const { error } = schema.validate(req.body.eventId, req.body.guestId);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  return next();
};

const validate = {
  giftValidation
};

export default validate;
