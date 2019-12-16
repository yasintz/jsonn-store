import React from 'react';
import Template from '~/client/components/template';
import createPage from '../create-page';

interface AppProps {
  count: number;
}

const App: React.SFC<AppProps> = props => {
  return <Template count={props.count} page="create" />;
};

export default createPage(App, async ({ match, query, privateRoute }) => {
  const count = await privateRoute('get-count');

  return { count };
});
