import { Request, Router } from 'express';
import SocketIO from 'socket.io';
import User, { UserTable } from '../database/models/user';
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

export type RequestWithUser = Request & { user: UserTable };

export type RouteType = (app: Router, context: ServerContext) => void;
