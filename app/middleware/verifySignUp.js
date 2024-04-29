import Joi from 'joi';
import db from '../models/index.js';

const { user: User, ROLES } = db;

const checkRequiredFields = (req, res, next) => {
  // Define validation schema
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phoneNumber: Joi.string().regex(/^\d{10}$/).messages({'string.pattern.base': 'Phone number must have 10 digits.'})
  });

  // Validate data against schema
  const { error } = schema.validate(req.body);

  
  if (error) {
    return res.status(400).send({error: true, message: error.details[0].message });
  }
  return next();
};

const checkDuplicateEmail = async (req, res, next) => {
  try {
    // Check if email exists
    const emailUser = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (emailUser) {
      return res.status(400).send({
        message: 'Failed! Email is already in use!'
      });
    }

    return next();
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.role && !ROLES.includes(req.body.role)) {
    return res.status(400).send({
      message: `Failed! Role does not exist = ${ req.body.role}`
    });
  }
  
  return next();
};

const checkRequiredFieldsForLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({error: true, message: error.details[0].message });
  }
  return next();
};

export default {
  checkDuplicateEmail,
  checkRolesExisted,
  checkRequiredFields,
  checkRequiredFieldsForLogin
};
