import fs from 'fs';
import lodash from 'lodash';
import path from 'path';
import { Route } from '~/server/helpers';
import html from '~/html';
import clientRoutes from '~/client/pages';

const getDocById = (name: string) =>
  `${fs.readFileSync(path.join(process.cwd(), 'statics', 'doc', `${name}.md`), 'UTF-8')}`;

const privateRoutes = {
  getDocs: () => {
    return fs.readdirSync(path.join(process.cwd(), 'statics', 'doc')).map(item => {
      const id = item.replace('.md', '');

      return {
        id,
        title: lodash.startCase(id),
        content: getDocById(id),
      };
    });
  },
};

const clientRoute: Route = {
  path: ['/', '/doc'],
  method: 'get',
  handler: ctx => [
    async (req, res) => {
      const matches = clientRoutes.map((route, index) => {
        // const match = matchPath(req.url, route.path, route);
        return {
          route,
          // match,
          promise: route.getInitialData
            ? route.getInitialData({
                privateRoute: (key: string, params: any) => (privateRoutes[key] ? privateRoutes[key](params) : null),
              })
            : Promise.resolve(null),
        };
      });
      Promise.all(matches.map(({ promise }) => promise)).then(data => {
        res.send(
          html(
            {
              initialData: data,
            },
            req.url,
          ),
        );
      });
    },
  ],
};

export default clientRoute;
