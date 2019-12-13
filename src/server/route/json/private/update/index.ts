import { RouteType } from '~/server/helpers';
import updateJsonContentRoute from './content';
import updateJsonAccessRoute from './access';

const updateJsonRoute: RouteType = (app, ctx) => {
  updateJsonContentRoute(app, ctx);

  updateJsonAccessRoute(app, ctx);
};

export default updateJsonRoute;
