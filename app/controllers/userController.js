import db from '../models/index.js';

const { user: USER } = db;

export const updateUsers = async (req, res) => {
  try {
    const { userId } = req;
    const { fullName, phoneNumber, password } = req.body;

    const userUpdated = await USER.update({ fullName, phoneNumber, password }, { where: { id: userId } });

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
    res.status(200).send({error: false, data: userData});
  }
  res.status(200).send({error: true, message: 'User not found!'});
};

export const adminBoard = (req, res) => {
  res.status(200).send('Admin Content.');
};
