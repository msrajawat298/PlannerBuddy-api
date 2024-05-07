import bcrypt from 'bcryptjs';
import { updateUsers, getUserDetails, adminBoard } from '../userController.js';
import { HASHED_PASSWORD } from '../../utils/constant.js';

test('checks if updateUsers function works correctly', async () => {
  const req = {
    userId: 1,
    body: {
      fullName: 'John Doe',
      phoneNumber: '1234567890',
      password: bcrypt.hashSync('password123', HASHED_PASSWORD)
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(), // mock function, chainable
    send: jest.fn() // mock function
  };

  await updateUsers(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith({ error: false, message: 'Request completed' });
});

test('checks if getUserDetails function works correctly', async () => {
  const req = { userId: 1 };

  const res = {
    status: jest.fn().mockReturnThis(), // mock function, chainable
    send: jest.fn() // mock function
  };

  await getUserDetails(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  const data = res.send.mock.calls[0][0].data.dataValues;
  expect(data).toEqual({ id: 1, fullName: 'John Doe', email: 'Eliezer94@yahoo.com' });
});

test('checks if getUserDetails function handles user not found', async () => {
  const req = { userId: 2 };

  const res = {
    status: jest.fn().mockReturnThis(), // mock function, chainable
    send: jest.fn() // mock function
  };

  await getUserDetails(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith({ error: true, message: 'User not found!' });
});

test('checks if getUserDetails function handles user not found', async () => {
  const req = { userId: -2 };

  const res = {
    status: jest.fn().mockReturnThis(), // mock function, chainable
    send: jest.fn() // mock function
  };

  await getUserDetails(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith({ error: true, message: 'User not found!' });
});

test('checks if adminBoard function works correctly', async () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(), // mock function, chainable
    send: jest.fn() // mock function
  };

  await adminBoard(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith('Admin Content.');
});