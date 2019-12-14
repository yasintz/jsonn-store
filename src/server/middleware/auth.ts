import { Express } from 'express';
import jwt from 'jsonwebtoken';
import { ServerContext } from '../helpers';
import { HTTP401Error } from '../helpers/http-errors';

const auth = async (server: Express, ctx: ServerContext) => {
  server.use('/api', async (req, res, next) => {
    try {
      if (req.headers && req.headers.authorization) {
        const verifiedToken = jwt.verify(req.headers.authorization, ctx.JWT_SECRET) as any;
        const user = await ctx.db.User.getUserById(verifiedToken.userId);
        if (user) {
          res.locals.user = user;
          next();

          return;
        }
        throw new HTTP401Error('Failed to authenticate token!');
      }

      throw new HTTP401Error('No Token');
    } catch (err) {
      next(err);
    }
  });
};

export default auth;
