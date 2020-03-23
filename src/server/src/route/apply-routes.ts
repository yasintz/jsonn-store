import * as express from 'express';
import { Route, Controller, HandlerRoute, ExtenderController } from '@server/helpers';

function isController(route: any): route is Controller {
  return route.routes && route.router && route.path;
}

function isExtender(route: any): route is ExtenderController {
  return route.extenders;
}

function isHandlerRoute(route: any): route is HandlerRoute {
  return route.method && route.handler && route.path;
}

function applyRoutes(route: Route, router: express.Router): void {
  if (isController(route)) {
    const newRouter = route.router;
    const middlewares = route.middlewares ? route.middlewares : [];

    router.use(route.path, ...middlewares, newRouter);

    route.routes.forEach(childRote => applyRoutes(childRote, newRouter));

    return;
  }

  if (isExtender(route)) {
    route.extenders.forEach(childRote => applyRoutes(childRote, router));

    return;
  }

  if (isHandlerRoute(route)) {
    const { handler, method, path, middlewares } = route;
    const handlers = [...(middlewares || []), handler].map(
      item => async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          await item(req, res, next);
        } catch (error) {
          next(error);
        }
      },
    );
    if (handlers.length) {
      router[method](path, handlers);
    }

    return;
  }

  // eslint-disable-next-line no-console
  console.error('Routes is incorrect');
  process.exit(1);
}

export default applyRoutes;
