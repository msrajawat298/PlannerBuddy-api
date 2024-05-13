import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import guestRoutes from './guest.routes.js';
import eventRoutes from './event.route.js';
import giftsRoutes from './gifts.routes.js';

const applyRoutes = (app) => {
  // simple route
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to Vitabletech application. Click the link to know more about the endpoints.',
      websiteUrl: 'https://vitabletech.in/',
      documentationUrl: 'https://documenter.getpostman.com/view/21993237/2sA3BoaXHM'
    });
  });
  

  // routes
  authRoutes(app);
  userRoutes(app);
  guestRoutes(app);
  eventRoutes(app);
  giftsRoutes(app);
};

export default applyRoutes;