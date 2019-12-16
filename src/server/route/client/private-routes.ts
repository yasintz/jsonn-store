import lodash from 'lodash';
import path from 'path';
import fs from 'fs';
import { ServerContext } from '~/server/helpers';
import { JsonUserRole } from '~/server/database/models/user-json';

const getDocById = (name: string) =>
  `${fs.readFileSync(path.join(process.cwd(), 'statics', 'doc', `${name}.md`), 'UTF-8')}`;

const privateRoutes = (ctx: ServerContext) => ({
  'get-docs': async () => {
    return fs.readdirSync(path.join(process.cwd(), 'statics', 'doc')).map(item => {
      const id = item.replace('.md', '');

      return {
        id,
        title: lodash.startCase(id),
        content: getDocById(id),
      };
    });
  },
  'get-count': async () => {
    const jsonCount = await ctx.db.Json.getCount();

    return jsonCount;
  },
  'get-db': async (id: string) => {
    const currentDabase = await ctx.db.Json.getJsonById(id);
    if (currentDabase && currentDabase.read === JsonUserRole.everyone) {
      return currentDabase;
    }

    return null;
  },
});

export default privateRoutes;
