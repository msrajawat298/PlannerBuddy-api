import express from 'express';
import { addGuest, deleteGuest, updateGuest, getGuests, getGuestByid } from '../controllers/guestController.js'; // Import addGuest function
import authJwt from '../middleware/authJwt.js';
import GuestValidation from '../Validations/guestValidation.js';

export default function guestRoutes(app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });
  app.use(express.json());

  app.get('/guest', [authJwt.verifyToken], getGuests);
  app.get('/guest/:guestId', [authJwt.verifyToken], getGuestByid);

  app.post('/guest', [authJwt.verifyToken, GuestValidation()], addGuest);

  app.put('/guest/:guestId', [authJwt.verifyToken, GuestValidation(false)], updateGuest);

  app.delete('/guest', [authJwt.verifyToken], deleteGuest);
}
