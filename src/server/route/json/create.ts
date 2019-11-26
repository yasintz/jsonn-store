import { Express, Request } from 'express';
import database from '../../database';
import { makeid } from '../../utils';
import { jsonTable } from '../../database/table';
import { getUser } from '../../database/functions';
import { generateViewLink, generateApiLink } from '~/server/utils/link';

function responseCreator(req: Request, id: string) {
  return {
    url: generateApiLink(req, id),
    id,
    view: generateViewLink(req, id),
  };
}

export default (route: string, app: Express) => {
  app.post(route, async (req, res) => {
    try {
      const body = {
        data: {},
        isPrivate: false,
        ...req.body,
      };
      const dataString = JSON.stringify(body.data);
      const databaseId = makeid(9);
      if (body.username && body.password && body.isPrivate) {
        const user = await getUser(body.username, body.password);
        database.run(jsonTable.insertSql, [databaseId, dataString, 1, user.id]).then(() => {
          res.send(responseCreator(req, databaseId));
        });
      } else {
        database.run(jsonTable.insertSql, [databaseId, dataString, 0, null]).then(() => {
          res.send(responseCreator(req, databaseId));
        });
      }
    } catch (error) {
      res.send({ error });
    }
  });
};
