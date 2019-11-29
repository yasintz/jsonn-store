import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ServerContext, RequestWithUser } from '../helpers';
import { appError } from '../utils/errors';

const authFactory = (ctx: ServerContext) => async (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.headers && req.headers.authorization) {
    try {
      const verifiedToken = jwt.verify(req.headers.authorization, ctx.JWT_SECRET) as any;
      const user = await ctx.db.User.getUserById(verifiedToken.userId);
      if (user) {
        req.user = user;
        next();
      }
      throw appError('Failed to authenticate token!');
    } catch (err) {
      res.status(401).json({
        error: {
          msg: 'Failed to authenticate token!',
        },
      });
    }

    return;
  }

  res.status(401).json({
    error: {
      msg: 'No token!',
    },
  });
};

export default authFactory;
