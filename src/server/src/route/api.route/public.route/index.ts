import { Route } from '@server/helpers';
import authRoute from './auth.route';

const publicRoute: Route = {
  extenders: [authRoute],
};

export default publicRoute;
