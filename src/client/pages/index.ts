import React from 'react';
import { match } from 'react-router-dom';
import Doc from './doc';
import Home from './home';
import Detail from './detail'

export interface GetInitialDataProps {
  privateRoute: (routePath: string, params?: any) => Promise<any>;
  match: match | null;
  query: Record<string, string>;
  redirect: (path: string) => void;
}

export type GetInitialData = (props: GetInitialDataProps) => Promise<any>;

interface ClientRoute {
  path: string;
  component: React.ComponentType<any>;
  getInitialData?: GetInitialData;
}

const routes: ClientRoute[] = [
  {
    path: '/doc',
    ...Doc,
  },
  {
    path: '/',
    ...Home,
  },
  {
    path: '/view-json/:id',
    ...Detail,
  }
];

export default routes;
