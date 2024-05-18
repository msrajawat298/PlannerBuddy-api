import { Op } from 'sequelize'; 
import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { HASHED_PASSWORD, PASSWORD_RESET_SUBJECT, PASSWORD_RESET_MESSAGE_TEMPLATE } from '../utils/constant.js';
import { generateOTP } from '../utils/utils.js';
import sendEmail from '../utils/email.js';

const { user: USER } = db;

/**
 * Updates user information.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.fullName - The full name of the user.
 * @param {string} req.body.phoneNumber - The phone number of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {string} req.body.address - The address of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user information is updated.
 * @throws {Error} - If there is an error updating the user information.
 */
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

/**
 * Retrieves user details based on the provided user ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves once the user details are retrieved and sent in the response.
 */
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

/**
 * Handles the forget password functionality.
 * Generates an OTP, updates the user's OTP and OTP expiration time,
 * and sends an email with the OTP to the user's email address.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with a success message or an error message.
 */
export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await USER.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const otp = generateOTP();
  await USER.update({ otp, otpExpires: Date.now() + 3600000 }, { where: { email } });
  sendEmail(user.email, PASSWORD_RESET_SUBJECT, PASSWORD_RESET_MESSAGE_TEMPLATE(otp));
  return res.status(200).json({ message: 'OTP sent to your email' });
};

/**
 * Verifies the OTP and updates the user's password.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with a success message or an error message.
 */
export const verifyOtp = async (req, res) => {
  const { email, otp, password } = req.body;
  const user = await USER.findOne({ where: { email, otp, otpExpires: { [Op.gt]: Date.now() } } });
  if (!user) return res.status(404).json({ error: 'OTP is invalid or has expired' });
  const newPassword = bcrypt.hashSync(password, HASHED_PASSWORD);
  await USER.update({ password: newPassword, otp: null, otpExpires: null }, { where: { email } });
  return res.status(200).json({ message: 'Password updated successfully' });
};