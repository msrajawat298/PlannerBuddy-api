import express from 'express';
import {
  addEvent,
  getEvent,
  getEventByid,
  deleteById,
  updateStatus,
  addGuestToEvent
} from '../controllers/eventController.js';
import authJwt from '../middleware/authJwt.js';
import validate from '../Validations/addEventsValidation.js';

export default function guestRoutes(app) {
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.use(express.json());
  app.get('/event', [authJwt.verifyToken], getEvent);
  app.get('/event/:eventId', [authJwt.verifyToken], getEventByid);

  app.post('/event', [authJwt.verifyToken, validate.addEventValidation], addEvent);
  app.put('/event', [authJwt.verifyToken], updateStatus);
  app.post('/event/guests', [authJwt.verifyToken], addGuestToEvent);
  
  app.delete('/event/:eventId', [authJwt.verifyToken], deleteById);
}
