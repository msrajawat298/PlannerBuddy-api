import express from 'express';
import { addGuest, deleteGuest, updateGuest, getGuests, getGuestByid, syncGuest } from '../controllers/guestController.js'; // Import addGuest function
import authJwt from '../middleware/authJwt.js';
import validateGuest from '../Validations/guestValidation.js';

export default function guestRoutes(app) {
  app.use(express.json());

  app.get('/guest', [authJwt.verifyToken], getGuests);
  app.get('/guest/:guestId', [authJwt.verifyToken], getGuestByid);

  app.post('/guest', [authJwt.verifyToken, validateGuest.GuestValidation()], addGuest);
  app.post('/guest/sync', [authJwt.verifyToken, validateGuest.bulkGuestValidation], syncGuest);

  app.put('/guest/:guestId', [authJwt.verifyToken, validateGuest.GuestValidation(false)], updateGuest);

  app.delete('/guest/:guestId', [authJwt.verifyToken], deleteGuest);
}
