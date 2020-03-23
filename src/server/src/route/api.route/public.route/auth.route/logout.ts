import { Route } from '@server/helpers';

const logoutRoute: Route = {
  method: 'post',
  path: '/logout',
  handler: (req, res) => {
    req.logOut();
    res.send({ logout: true });
  },
};

export default logoutRoute;
