import { Route } from '~/server/helpers';
import createJsonRoute from './create';
import getJsonRoute from './get';
import updateJsonRoute from './update';

const jsonRoute: Route[] = [getJsonRoute, ...createJsonRoute, ...updateJsonRoute];

export default jsonRoute;
