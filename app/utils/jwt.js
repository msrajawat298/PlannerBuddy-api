import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const jwtOptions = {
  secret: process.env.JWT_SECRET,
  jwtOptions: {
    algorithm: 'HS256'
  }
};

/**
 * Generates a JWT token for the given user ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string>} - A promise that resolves to the generated token.
 * @throws {Error} - If there is an error while generating the token.
 */
export const generateToken = (userId) => new Promise((resolve, reject) => {
  try {
    const token = jwt.sign({ id: userId }, jwtOptions.secret, jwtOptions.jwtOptions);
    resolve(token);
  } catch (err) {
    reject(err);
  }
});

/**
 * Verifies the given token and resolves with the decoded user ID if the token is valid.
 * @param {string} token - The token to be verified.
 * @returns {Promise<string|boolean>} - A promise that resolves with the decoded user ID if the token is valid, or false otherwise.
 */
export const verifyTokens = (token) => new Promise((resolve) => {
  jwt.verify(token, jwtOptions.secret, (err, decoded) => {
    if (err) resolve(false);
    resolve(decoded.id);
  });
});