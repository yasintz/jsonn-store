import { Route } from '~/server/helpers';
import updateJsonContentRoute from './content';
import updateJsonAccessRoute from './access';

const updateJsonRoute: Route[] = [updateJsonContentRoute, updateJsonAccessRoute];

export default updateJsonRoute;
