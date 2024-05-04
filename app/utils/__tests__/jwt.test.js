import jwt from 'jsonwebtoken';
import { verifyTokens, generateToken } from '../jwt.js';

jest.mock('jsonwebtoken');

describe('verifyTokens', () => {
  test('should return decoded id if token is valid', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiaWF0IjoxNzE0Mzg4NTcwLCJleHAiOjE3MTQ0NzQ5NzB9.XJaTMCaO1mc5KvZzx_42LQMRZm15rFn59fvmVQWA1Vo';
    const decoded = { id: 9 };
    jwt.verify.mockImplementation((_token, _secret, callback) => {
      callback(null, decoded);
    });

    const result = await verifyTokens(token);

    expect(result).toEqual(decoded.id);
    expect(jwt.verify).toHaveBeenCalledWith(token, expect.anything(), expect.any(Function));
  });

  test('should return false if token is invalid', async () => {
    const token = 'invalidToken';
    jwt.verify.mockImplementation((_token, _secret, callback) => {
      callback(new Error('Invalid token'));
    });
  
    const result = await verifyTokens(token);
  
    expect(result).toBe(false);
  });

  test('should generate a valid token', async () => {
    const userId = 9;
    const expectedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiaWF0IjoxNzE0Mzg4NTcwLCJleHAiOjE3MTQ0NzQ5NzB9.XJaTMCaO1mc5KvZzx_42LQMRZm15rFn59fvmVQWA1Vo';
    jwt.sign.mockReturnValueOnce(expectedToken);
  
    const result = await generateToken(userId);
  
    expect(result).toEqual(expectedToken);
    expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, expect.anything(), expect.anything());
  });
});
