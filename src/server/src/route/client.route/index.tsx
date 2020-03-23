import { Route } from '@server/helpers';
import view from '@server/view';

const clientRoute: Route = {
  path: '*',
  method: 'get',
  handler: async (req, res, next) => {
    try {
      res.send(await view({ req, res }));
    } catch (error) {
      next(error);
    }
  },
};

export default clientRoute;
