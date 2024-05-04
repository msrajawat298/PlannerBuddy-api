/* eslint-disable consistent-return */
import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import { SUCCESS_REGISTRATION, SUCCESS_REGISTRATION_USER_ROLE, USER_NOT_FOUND, INVALID_PASSWORD, HASHED_PASSWORD } from '../utils/constant.js';

const { user: User, role: Role } = db;

export const signup = (req, res) => {
  // Save User to Database
  const {fullName, email, password, phoneNumber } = req.body;
  User.create({
    fullName,
    email,
    password: bcrypt.hashSync(password, HASHED_PASSWORD),
    phoneNumber
  })
    .then(user => {
      if (req.body.role) {
        Role.findOne({
          where: {
            name: req.body.role
          },
          attributes: ['id']
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({error: false, message: SUCCESS_REGISTRATION });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({error: false, message: SUCCESS_REGISTRATION_USER_ROLE });
        });
      }
    })
    .catch(err => {
      res.status(500).send({error: true, message: err.message });
    });
};

export const signin = async (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(404).send({ message: USER_NOT_FOUND });
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: INVALID_PASSWORD
        });
      }
      const accessToken = await generateToken(user.id);
      user.getRoles().then(() => {
        res.status(200).send({error:false, userId: user.id, fullName: user.fullName, email: user.email, phoneNumber: user.phoneNumber, address: user.address, accessToken });
      });
    })
    .catch(err => res.status(500).send({error: true, message: err.message }));
};

