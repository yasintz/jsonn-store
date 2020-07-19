import ms from 'ms';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import express from 'express';
import applyErrorHandlers from './middleware/error-handler';
import { connectToDatabase } from './database';
import routes from './routes';
import HTTPClientError from './helpers/http-client-error';
import { validateSchemaMiddleware } from './middleware';
// import { HTTP_ERROR_MESSAGES } from './utils/constants';

require('dotenv').config();

const PORT = process.env.PORT || 9000;
const UPLOAD_LIMIT = '2mb';

// const allowedOrigins = ['http://localhost:5000'];

const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    // if (allowedOrigins.indexOf(origin) === -1) {
    //   return callback(new HTTPClientError(400, HTTP_ERROR_MESSAGES.CORS_POLICY), false);
    // }

    return callback(null, true);
  },
});

class App {
  express: express.Express;

  constructor() {
    this.express = express();
    this.loadExpressConfiguration();
    this.applyControllers();
    this.applyErrorHandler();
    // remove unused database
  }

  private loadExpressConfiguration = () => {
    this.express
      .disable('x-powered-by')
      .use(express.urlencoded({ limit: '5mb', extended: false }))
      .use(cookieParser())
      .use(corsMiddleware)

      .use(express.json({ limit: UPLOAD_LIMIT }));
  };

  private applyControllers = () => {
    routes.forEach(route => {
      const { handler, method, path, middlewares, rateLimit: routeRateLimit, schema: routeSchema } = route;
      const rateLimiter = rateLimit({
        max: routeRateLimit.max,
        windowMs: ms(routeRateLimit.windowMs),
        handler: (req, res, next) => {
          next(new HTTPClientError(429, routeRateLimit.message));
        },
      });

      const handlers = [rateLimiter, validateSchemaMiddleware(routeSchema), ...middlewares, handler].map(
        item => async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await item(req as any, res, next);
          } catch (error) {
            next(error);
          }
        },
      );

      this.express[method](path, handlers);
    });
  };

  private applyErrorHandler = () => {
    applyErrorHandlers(this.express);
  };
}

connectToDatabase().then(() => {
  const app = new App();
  app.express.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started on ${PORT}, environment: ${process.env.NODE_ENV}`);
  });
});
