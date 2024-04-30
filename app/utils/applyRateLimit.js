import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 10 * 1000, // 10 Seconds
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: 'request limit exceeded, please wait a few seconds'
  },
  skip: () => false
});


/**
 * Applies rate limiting middleware to the Express app.
 *
 * @param {Object} app - The Express app object.
 * app.set('trust proxy', 1); 
 * This tells Express.js to trust the first proxy. 
 * This is necessary if your application is behind a reverse proxy (like a load balancer), 
 * and you want to access the IP address of the client, not the IP address of the proxy. 
 * This is also necessary for the express-rate-limit middleware to work correctly when your application is behind a proxy, 
 * as it uses the IP address to track requests.
 */
const applyRateLimit = app => {
  app.set('trust proxy', 1); // for express-rate-limit
  app.use(limiter);
};

export default applyRateLimit;