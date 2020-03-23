import { AsyncComponent, asyncComponent } from '@jaredpalmer/after';

import '@client/assets/style/app.css';
import Loading from '../components/loading';
import NotFound from './not-found';

export type PageComponent<P = any> = Partial<AsyncComponent> & (React.StatelessComponent<P> | React.ComponentClass<P>);

export interface Page {
  path?: string;
  exact?: boolean;
  component: any;
}

const routes: Page[] = [
  {
    path: '/',
    exact: true,
    component: asyncComponent({ loader: () => import('./home'), Placeholder: Loading }),
  },
  {
    path: '/login',
    exact: true,
    component: asyncComponent({ loader: () => import('./login'), Placeholder: Loading }),
  },
  {
    path: '/about',
    exact: true,
    component: asyncComponent({ loader: () => import('./about'), Placeholder: Loading }),
  },
  {
    component: NotFound,
  },
];

export default routes;
