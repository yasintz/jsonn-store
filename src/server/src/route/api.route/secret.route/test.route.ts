import { Route } from '@server/helpers';

const testRoute: Route = {
  method: 'get',
  path: '/test',
  handler: (req, res) => {
    res.json({ user: req.user, test: true });
  },
};

export default testRoute;
