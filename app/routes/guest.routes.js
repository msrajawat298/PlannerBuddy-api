import express from 'express';
import { addGuest, deleteGuest, updateGuest } from '../controllers/guestController.js'; // Import addGuest function
import authJwt from '../middleware/authJwt.js';
import GuestValidation from '../Validations/guestValidation.js';

export default function guestRoutes(app) {
  app.use(express.json());

  app.post('/guest', [authJwt.verifyToken, GuestValidation()], addGuest);

  app.put('/guest/:guestId', [authJwt.verifyToken, GuestValidation(false)], updateGuest);

  app.delete('/guest', [authJwt.verifyToken], deleteGuest);
}
