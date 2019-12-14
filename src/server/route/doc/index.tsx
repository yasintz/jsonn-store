import React from 'react';
import fs from 'fs';
import lodash from 'lodash';
import path from 'path';
import { Route } from '~/server/helpers';
import DocClient from '~/client/doc';
import html from '~/html';

const getDocById = (name: string) =>
  `${fs.readFileSync(path.join(process.cwd(), 'statics', 'doc', `${name}.md`), 'UTF-8')}`;

const docRoute: Route = {
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
          app: <DocClient items={items} />,
          sources: `
        <style>
            html { scroll-behavior: smooth; }  
        </style> 
        <script>
            window.PAGE_TYPE='doc';
            window.PAGE_PROPS=${JSON.stringify({ items })};
        </script>
    `,
        }),
      );
    },
  ],
};

export default docRoute;
