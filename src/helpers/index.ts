import { Request, Response, NextFunction } from 'express';
import Joi from '@hapi/joi';

export interface RouteParamsSchema {
  body?: Joi.ObjectSchema;
  headers?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

export type Handler<
  ResponseType = never,
  Params extends { [key: string]: string } = never,
  Body = never,
  Query = never
> = (
  req: Request<Params, never, Body, Query>,
  res: Omit<Response, 'locals' | 'json' | 'send'> & {
    json: (data: ResponseType) => void;
  },
  next: NextFunction,
) => void;

export enum OrderField {
  ASC,
  DESC,
  NOT_ORDER,
}

export type SerializedModelType<SerializedFields extends keyof Model, Model> = Pick<Model, SerializedFields> &
  {
    [P in keyof Omit<Model, keyof Pick<Model, SerializedFields>>]?: never;
  };
