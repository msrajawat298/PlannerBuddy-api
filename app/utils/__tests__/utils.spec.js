import { testFunction, generateOTP, addTwoNumbers } from '../utils.js';

describe('testFunction', () => {
  it('should log a message', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    testFunction();
    expect(consoleSpy).toHaveBeenCalledWith('This is a test function');
    consoleSpy.mockRestore();
  });
});

describe('testFunction', () => {
  it('should log a message', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    testFunction();
    expect(consoleSpy).toHaveBeenCalledWith('This is a test function');
    consoleSpy.mockRestore();
  });
});

describe('addTwoNumbers', () => {
  it('should return the sum of two numbers', () => {
    const result = addTwoNumbers(2, 3);
    expect(result).toBe(5);
  });

  it('should return the sum of negative numbers', () => {
    const result = addTwoNumbers(-5, -10);
    expect(result).toBe(-15);
  });

  it('should return the sum of a positive and a negative number', () => {
    const result = addTwoNumbers(8, -4);
    expect(result).toBe(4);
  });
});

describe('generateOTP', () => {
  it('should generate a 6-digit OTP', () => {
    const otp = generateOTP();
    expect(otp).toMatch(/^\d{6}$/);
  });
});