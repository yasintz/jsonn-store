import { Request } from 'express';
import { RouteType, RequestWithUser } from '~/server/helpers';
import { generateViewLink, generateApiLink } from '~/server/utils/link';
import { accessIsCorrect } from '~/server/utils';
import { appError } from '~/server/utils/errors';
import { JsonUserRole } from '~/server/database/models/user-json';

interface PostPutBody {
  data: any;
  write: JsonUserRole;
  read: JsonUserRole;
}

function responseCreator(req: Request, id: string) {
  return {
    url: generateApiLink(req, id),
    id,
    view: generateViewLink(req, id),
  };
}

const createJsonRoute: RouteType = app => {
  /* CREATE JSON */
  app.post('/json', async (req, res) => {
    try {
      const body = req.body || {};
      const { user } = req as RequestWithUser;
      const jsonRow = await user.createNewJson(
        body.data,
        { read: JsonUserRole.admin, write: JsonUserRole.admin },
        JsonUserRole.admin,
      );

      res.send(responseCreator(req, jsonRow.id));
    } catch (error) {
      res.send({ error });
    }
  });

  /* CREATE JSON WITH ACCESS */
  app.post('/json/with-access', async (req, res) => {
    try {
      const body = {
        data: {},
        read: JsonUserRole.admin,
        write: JsonUserRole.admin,
        ...req.body,
      } as PostPutBody;
      const { user } = req as RequestWithUser;
      if (accessIsCorrect(body.read) && accessIsCorrect(body.write)) {
        const jsonRow = await user.createNewJson(body.data, { read: body.read, write: body.write }, JsonUserRole.admin);
        res.send(responseCreator(req, jsonRow.id));

        return;
      }
      throw appError(`Access Must Be a [${Object.keys(JsonUserRole).join(', ')}]`);
    } catch (error) {
      res.send({ error });
    }
  });
};

export default createJsonRoute;
