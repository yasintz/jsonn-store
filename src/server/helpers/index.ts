import { Express } from 'express';
import SocketIO from 'socket.io';
import User from '../database/models/user';
import Json from '../database/models/json';

export interface DBContext {
  User: User;
  Json: Json;
}

export interface ServerContext {
  db: DBContext;
  socket: SocketIO.Server;
}

export type RouteType = (path: string, app: Express, context: ServerContext) => void;
