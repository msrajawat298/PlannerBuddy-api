export const SUCCESS_REGISTRATION = 'User registered successfully!';
export const SUCCESS_REGISTRATION_USER_ROLE = 'User registered successfully with role user!';
export const USER_NOT_FOUND = 'User Not found.';
export const INVALID_PASSWORD = 'Invalid Password!';
export const HASHED_PASSWORD = 8;
export const PASSWORD_RESET_SUBJECT = 'Password Reset OTP';
export const PASSWORD_RESET_MESSAGE_TEMPLATE = (otp) => `You are receiving this because you (or someone else) have requested the reset of the password for your account.<br/><br/> Please use the following OTP to reset your password:<br/><br/> <b>OTP: ${otp}</b><br/><br/> If you did not request this, please ignore this email and your password will remain unchanged.<br/>`;