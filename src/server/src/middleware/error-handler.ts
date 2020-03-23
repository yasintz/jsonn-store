/* eslint-disable no-console,global-require */
import { Request, Response, NextFunction, Router, Express } from 'express';
import get500Html from '@server/view/500';
import { HTTPClientError } from '../helpers/http-errors';

const handleClientErrors = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HTTPClientError) {
      console.error(`Client Error : ${err}`);
      res.status(err.statusCode).send(err.message);
    } else {
      next(err);
    }
  });
};

const handleServerErrors = (router: Router) => {
  router.use(async (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`Server Error : ${error}`);

    if (process.env.NODE_ENV !== 'development') {
      res.status(500).send(get500Html());
    } else {
      // res.status(500).send(get500Html());
      res.status(500).send(error.stack);
    }
  });
};

export default (server: Express) => {
  handleClientErrors(server);
  handleServerErrors(server);
};
