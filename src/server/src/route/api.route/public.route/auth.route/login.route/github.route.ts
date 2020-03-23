import * as express from 'express';
import { Route } from '@server/helpers';
import passport from 'passport';

const githubRoute: Route = {
  path: '/github',
  router: express.Router(),
  routes: [
    {
      path: '/',
      method: 'get',
      handler: passport.authenticate('github', { scope: ['profile', 'email', 'username'] }),
    },
    {
      path: '/callback',
      method: 'get',
      middlewares: [passport.authenticate('github', { failureRedirect: '/login' })],

      handler: (req, res) => {
        res.redirect('/');
      },
    },
  ],
};

export default githubRoute;
