import express from 'express';
import { createEventGift, getEventGifts, deleteGift } from '../controllers/giftController.js';
import authJwt from '../middleware/authJwt.js';
import validate from '../Validations/giftValidation.js';

export default function guestRoutes(app) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });
  app.use(express.json());
  app.get('/gift', [authJwt.verifyToken], getEventGifts);
  
  app.post('/gift', [authJwt.verifyToken, validate.giftValidation], createEventGift);

  app.delete('/gift/:giftId', [authJwt.verifyToken], deleteGift);
}
