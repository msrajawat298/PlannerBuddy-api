import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { HASHED_PASSWORD } from '../utils/constant.js';

const { user: USER } = db;

export const updateUsers = async (req, res) => {
  try {
    const { userId } = req;
    const { fullName, phoneNumber, password, address } = req.body;
    const updateFields = { fullName, phoneNumber, address };
    if (password) updateFields.password = bcrypt.hashSync(password, HASHED_PASSWORD);
    const userUpdated = await USER.update({ ...updateFields }, { where: { id: userId } });
    if (!userUpdated) res.status(404).send({ error: true, message: 'Not found' });

    res.status(200).send({ error: false, message: 'Request completed' });
  } catch (err) {
    res.status(500).send({ error: true, message: err.message });
  }
};

export const getUserDetails = async (req, res) => {
  const { userId } = req;
  const userData = await USER.findOne({ where: { id: userId }, attributes: ['id', 'fullName', 'email'] });
  if (userData) {
    return res.status(200).send({error: false, data: userData});
  }
  return res.status(200).send({error: true, message: 'User not found!'});
};

export const adminBoard = (req, res) => {
  res.status(200).send('Admin Content.');
};

/**
 * Change the password for a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the password is changed.
 */
export const changePassword = async (req, res) => {
  const { userId } = req;
  const { oldPassword, password } = req.body;
  const user = await USER.findOne({ where: { id: userId } });
  if (!bcrypt.compareSync(oldPassword, user.password)) {
    return res.status(401).send({ error: true, message: 'Old password is incorrect!' });
  }
  const newPassword = bcrypt.hashSync(password, HASHED_PASSWORD);
  const userUpdated = await USER.update({ newPassword }, { where: { id: userId } });
  if (!userUpdated) res.status(404).send({ error: true, message: 'Not found' });

  return res.status(200).send({ error: false, message: 'Request completed' });
};