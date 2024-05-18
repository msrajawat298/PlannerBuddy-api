import authJwt from '../middleware/authJwt.js';
import { getUserDetails, updateUsers, adminBoard, changePassword } from '../controllers/userController.js';
import validate from '../Validations/userValidation.js';

export default function userRoutes(app) {
  app.get( '/api/user', [authJwt.verifyToken], getUserDetails);
  app.put( '/api/user', [authJwt.verifyToken, validate.userUpdateValidation], updateUsers);
  app.put( '/api/user/changePassword', [authJwt.verifyToken, validate.changePasswordValidation], changePassword);
  app.get('/api/admin',[authJwt.verifyToken, authJwt.isAdmin],adminBoard);
}
