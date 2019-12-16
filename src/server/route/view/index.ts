import fs from 'fs';
import lodash from 'lodash';
import path from 'path';
import { Route } from '~/server/helpers';
import { PageProps } from '~/helpers';
import { JsonUserRole } from '~/server/database/models/user-json';
import html from '~/html';

function template(context: PageProps, hasError?: boolean) {
  return html({
    props: { context },
    type: 'app',
  });
}
const getDocById = (name: string) =>
  `${fs.readFileSync(path.join(process.cwd(), 'statics', 'doc', `${name}.md`), 'UTF-8')}`;

const homeRoute: Route[] = [
  {
    path: '/doc',
    method: 'get',
    handler: () => [
      (req, res) => {
        const items = fs.readdirSync(path.join(process.cwd(), 'statics', 'doc')).map(item => {
          const id = item.replace('.md', '');

          return {
            id,
            title: lodash.startCase(id),
            content: getDocById(id),
          };
        });

        res.send(
          html({
            props: { context: items },
            type: 'doc',
          }),
        );
      },
    ],
  },
  {
    path: '/',
    method: 'get',
    handler: ctx => [
      async (req, res) => {
        const { id: databaseId } = req.query;
        try {
          const jsonCount = await ctx.db.Json.getCount();
          if (databaseId) {
            const currentDabaase = await ctx.db.Json.getJsonById(databaseId);
            if (currentDabaase && currentDabaase.read === JsonUserRole.everyone) {
              const context: PageProps = {
                jsonCount,
                mode: 'view',
                database: {
                  id: currentDabaase.id,
                  json: currentDabaase.json,
                },
              };
              res.send(template(context));
            } else {
              res.redirect('/');
            }
          } else {
            const context: PageProps = {
              jsonCount,
              mode: 'create',
            };
            res.send(template(context));
          }
        } catch (error) {
          // TODO: send error mode
          // res.send(template(null, true));
        }
      },
    ],
  },
];

export default homeRoute;
