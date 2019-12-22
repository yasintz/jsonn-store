import { Request } from 'express';
import { Route } from '~/server/helpers';
import { generateViewLink, generateApiLink } from '~/server/utils/link';
import { JsonUserRole } from '~/server/database/models/user-json';
import { checkAccessParams } from '~/server/middleware/check';
import { UserTable } from '~/server/database/models/user';

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

const createJsonRoute: Route[] = [
  {
    path: '/json',
    method: 'post',
    handler: () => [
      async (req, res, next) => {
        try {
          const user = res.locals.user as UserTable;
          const jsonRow = await user.createNewJson(
            req.body.data || {},
            { read: JsonUserRole.admin, write: JsonUserRole.admin },
            JsonUserRole.admin,
          );

          res.send(responseCreator(req, jsonRow.id));
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: 'json/with-access',
    method: 'post',
    handler: () => [
      checkAccessParams,
      async (req, res) => {
        const body = {
          data: {},
          read: JsonUserRole.admin,
          write: JsonUserRole.admin,
          ...req.body,
        } as PostPutBody;
        const user = res.locals.user as UserTable;
        const jsonRow = await user.createNewJson(body.data, { read: body.read, write: body.write }, JsonUserRole.admin);
        res.send(responseCreator(req, jsonRow.id));
      },
    ],
  },
];

export default createJsonRoute;
