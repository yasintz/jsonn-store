import React from 'react';
import Template from '~/client/components/template';

interface AppProps {
  count: number;
}

const App: React.SFC<AppProps> = props => {
  return <Template count={props.count} page="create" />;
};

export default App;
