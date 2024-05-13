import express from 'express';
import { createEventGift, getEventGifts } from '../controllers/giftController.js';
import authJwt from '../middleware/authJwt.js';

export default function guestRoutes(app) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });
  app.use(express.json());
  app.get('/api/gift', [authJwt.verifyToken], getEventGifts);
  
  app.post('/api/gift', [authJwt.verifyToken], createEventGift);
}
