import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import applyRoutes from './Router.js';
import applyRateLimit from '../utils/applyRateLimit.js';

// enable CORS.
const applyCors = (app) => app.use(cors());

// use helmet JS.
const applyHelmet = (app) => app.use(helmet());

// enable compression.
const applyCompression = (app) => app.use(compression());

const applyBodyParsers = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

const applyNotFoundHandler = (app) => {
  // Catch-all route for unmatched routes
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
};

const applyRouter = (app) => {

  // Apply all the middlewares
  applyCompression(app);
  applyCors(app);
  applyHelmet(app);
  applyBodyParsers(app);
  applyRateLimit(app);

  // Apply all the routes
  applyRoutes(app);
  applyNotFoundHandler(app);
};

export default applyRouter;