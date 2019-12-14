/* eslint-disable no-console,global-require */
import { Request, Response, NextFunction, Router, Express } from 'express';
import { HTTPClientError } from '../helpers/http-errors';

const handleClientErrors = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // console.log(err);
    if (err instanceof HTTPClientError) {
      // console.warn(err);
      res.status(err.statusCode).send(err.message);
    } else {
      next(err);
    }
  });
};

const handleServerErrors = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('server error');
    // console.error(err);
    if (process.env.NODE_ENV === 'production') {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(500).send(err.stack);
    }
  });
};

export default (server: Express) => {
  handleClientErrors(server);
  handleServerErrors(server);
};
