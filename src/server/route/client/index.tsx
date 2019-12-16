import { matchPath } from 'react-router-dom';
import { Route } from '~/server/helpers';
import html from '~/html';
import clientRoutes from '~/client/pages';
import privateRoutes from './private-routes';

const clientRoute: Route = {
  path: ['/', '/doc', '/view-json/:id'],
  method: 'get',
  handler: ctx => [
    async (req, res) => {
      const context = { url: '' };
      const _privateRoutes = privateRoutes(ctx);
      const matches = clientRoutes.map((route, index) => {
        const match = matchPath(req.path, route);

        return {
          route,
          // match,
          promise:
            route.getInitialData && match
              ? route.getInitialData({
                  privateRoute: (key: string, params: any) =>
                    _privateRoutes[key] ? _privateRoutes[key](params) : null,
                  match,
                  query: req.query,
                  redirect: path => {
                    if (path !== req.path) {
                      context.url = path;
                    }
                  },
                })
              : Promise.resolve(null),
        };
      });

      Promise.all(matches.map(({ promise }) => promise)).then(data => {
        if (context.url) {
          res.redirect(context.url);

          return;
        }
        const htmlString = html({
          props: {
            initialData: data,
          },
          url: req.url,
          ctx: context,
        });
        if (context.url) {
          res.redirect(301, context.url);

          return;
        }

        res.send(htmlString);
      });
    },
  ],
};

export default clientRoute;
