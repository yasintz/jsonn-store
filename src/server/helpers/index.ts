import { Request, Response, NextFunction } from 'express';
import SocketIO from 'socket.io';
import User from '../database/models/user';
import Json from '../database/models/json';
import JsonUser from '../database/models/user-json';

export interface DBContext {
  User: typeof User;
  Json: typeof Json;
  JsonUser: typeof JsonUser;
}

export interface ServerContext {
  db: DBContext;
  socket: SocketIO.Server;
  JWT_SECRET: string;
}

export enum DatabaseUpdateActions {
  replace = 'replace',
  assign = 'assign',
  deepAssign = 'deep-assign',
  push = 'push',
  contact = 'contact',
}

export type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export type HandlerWithContext = (
  ctx: ServerContext,
) => (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export type Route = {
  path: string;
  method: 'get' | 'post' | 'put';
  handler: (ctx: ServerContext) => Handler[];
};
