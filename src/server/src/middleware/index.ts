import { Middleware } from '@server/helpers';
import passport from 'passport';
import { HTTP400Error, HTTP401Error } from '@server/helpers/http-errors';

const authenticationMiddleware: Middleware = (req, res, next) => {
  if (!req.isAuthenticated()) {
    passport.authenticate('jwt', { session: false }, (error, user) => {
      if (error) {
        next(error);

        return;
      }
      if (!user) {
        throw new HTTP401Error('Invalid Token');
      }

      next();
    })(req, res, next);

    return;
  }

  next();
};

const checkAuthBodyMiddleware: Middleware = (req, res, next) => {
  if (!(req.body && req.body.username && req.body.password)) {
    throw new HTTP400Error('Missing username password');
  }

  next();
};

export { checkAuthBodyMiddleware, authenticationMiddleware };
