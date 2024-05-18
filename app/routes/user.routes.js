import authJwt from '../middleware/authJwt.js';
import { getUserDetails, updateUsers, adminBoard, changePassword, forgetPassword, verifyOtp } from '../controllers/userController.js';
import validate from '../Validations/userValidation.js';

export default function userRoutes(app) {
  app.get( '/api/user', [authJwt.verifyToken], getUserDetails);
  app.get('/api/admin',[authJwt.verifyToken, authJwt.isAdmin],adminBoard);

  app.put( '/api/user', [authJwt.verifyToken, validate.userUpdateValidation], updateUsers);
  app.put( '/api/user/changePassword', [authJwt.verifyToken, validate.changePasswordValidation], changePassword);

  app.post( '/api/user/forgetPassword', [validate.forgetPasswordValidation], forgetPassword);
  app.post( '/api/user/verify-otp', [validate.verifyOtpValidation], verifyOtp);
}
