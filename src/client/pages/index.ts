import React from 'react';
import { match } from 'react-router-dom';
import Doc from './doc';
import Home from './home';

interface GetInitialDataProps {
  privateRoute: (routePath: string, params?: any) => Promise<any>;
  // match: match;
}

interface ClientRoute {
  path: string;
  component: React.SFC<any>;
  getInitialData?: (props: GetInitialDataProps) => Promise<any>;
}

const routes: ClientRoute[] = [
  {
    component: Doc,
    path: '/doc',
    getInitialData: async ({ privateRoute }) => {
      const docs = await privateRoute('getDocs');

      return docs;
    },
  },
  {
    component: Home,
    path: '/',
  },
];

export default routes;
