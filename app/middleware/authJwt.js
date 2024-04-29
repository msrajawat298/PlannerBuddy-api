/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
import db from '../models/index.js';
import { verifyTokens } from '../utils/jwt.js';

const { user: User } = db;

const verifyToken = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(403).send({error: true, message: 'No token provided!'});
  const userId = await verifyTokens(token);
  if (!userId) return res.status(401).send({message: 'Unauthorized!'});
  req.userId = userId;
  next();
};

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (const element of roles) {
        if (element.name === 'admin') {
          next();
          return;
        }
      }
      res.status(403).send({ error: true, message: 'Unauthorized, Please Check your Token'});
      
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin
};

export default authJwt;
