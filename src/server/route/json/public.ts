import { Request } from 'express';
import { DatabaseUpdateActions, Route } from '~/server/helpers';
import { generateViewLink, generateApiLink } from '~/server/utils/link';
import { schemaParser } from '~/server/utils';
import { JsonUserRole } from '~/server/database/models/user-json';
import jsonUpdater from '~/server/utils/json-updater';
import { checkHasJson, checkHasData } from '~/server/middleware/check';
import { JsonTable } from '~/server/database/models/json';
import { HTTP404Error, HTTP400Error } from '~/server/helpers/http-errors';

interface PutQuery {
  action: DatabaseUpdateActions;
  path: string;
  schema: string;
}

function responseCreator(req: Request, id: string) {
  return {
    url: generateApiLink(req, id, true),
    id,
    view: generateViewLink(req, id),
  };
}

const jsonRoute: Route[] = [
  {
    path: '/json',
    method: 'post',
    handler: ({ db }) => [
      async (req, res, next) => {
        try {
          const data = req.body || {};
          const json = await db.Json.create(data, JsonUserRole.everyone, JsonUserRole.everyone);
          res.send(responseCreator(req, json.id));
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: '/json/:id',
    method: 'put',
    handler: ctx => [
      checkHasData,
      checkHasJson(ctx),
      async (req, res, next) => {
        try {
          const { path: databasePath, schema: databaseSchema, action: databaseAction } = {
            action: DatabaseUpdateActions.REPLACE,
            path: '',
            schema: '',
            ...req.query,
          } as PutQuery;

          const jsonDb = res.locals.jsonDb as JsonTable;
          if (jsonDb.write !== JsonUserRole.everyone) {
            throw new HTTP400Error('Is Private you should use /api/json/ route');
          } else {
            const { newJson } = jsonUpdater(jsonDb.json, req.body.data, databasePath, databaseAction);
            const updatedJsonRow = await ctx.db.Json.updatePublicJson(jsonDb.id, newJson);
            // TODO: implement [socket]
            // if (databasePath) {
            //   socket.emit(`${jsonDb.id}/${databasePath}`, changedJson);
            // }
            // socket.emit(jsonDb.id, newJson);
            res.send({
              result: schemaParser(updatedJsonRow.json, databaseSchema),
            });
          }
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: '/json/:id',
    method: 'get',
    handler: ctx => [
      checkHasJson(ctx),
      async (req, res) => {
        const { schema: databaseSchema } = req.query;
        const jsonDb = res.locals.jsonDb as JsonTable;
        if (jsonDb.read !== JsonUserRole.everyone) {
          throw new HTTP404Error('Is Private you should use /api/json/ route');
        } else {
          const result = schemaParser(jsonDb.json, databaseSchema);
          res.send({ result });
        }
      },
    ],
  },
];

export default jsonRoute;
