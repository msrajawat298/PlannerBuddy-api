/**
 * This is a test function1.
 */
export const testFunction = () => {
  console.log('This is a test function');
};

/**
 * This is a test addTwoNumbers.
 */
export const addTwoNumbers = (num1, num2) => num1 + num2;

export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();