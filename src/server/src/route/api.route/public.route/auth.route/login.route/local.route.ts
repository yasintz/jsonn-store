import { Route } from '@server/helpers';
import passport from 'passport';
import { createToken } from '@server/utils/token.util';
import UserModel from '@server/database/models/user.model';

const localRoute: Route = {
  method: 'post',
  path: '/',
  middlewares: [passport.authenticate('local')],
  handler: (req, res) => {
    const user = req.user as UserModel;
    res.json({
      loggedIn: true,
      id: user.id,
      username: user.username,
      token: createToken(user.id, '1 day'),
    });
  },
};

export default localRoute;
