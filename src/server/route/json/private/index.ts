import { RouteType } from '~/server/helpers';
import createJsonRoute from './create';
import getJsonRoute from './get';
import updateJsonRoute from './update';

const jsonRoute: RouteType = (app, ctx) => {
  /* CREATE JSON */
  createJsonRoute(app, ctx);

  /* GET JSON */
  getJsonRoute(app, ctx);

  /* UPDATE JSON */
  updateJsonRoute(app, ctx);
};

export default jsonRoute;
