import React from 'react';
import { Switch, Route } from 'react-router-dom';

import '~/client/assets/style/app.css';
import routes from '../pages';

interface AppProps {
  initialData: any[];
}

const App: React.SFC<AppProps> = props => {
  return (
    <Switch>
      {routes.map((route, index) => {
        return (
          <Route
            exact
            key={index}
            path={route.path}
            render={p =>
              React.createElement(route.component, {
                ...p,
                initialData: props.initialData[index] || null,
              })
            }
          />
        );
      })}
    </Switch>
  );
};

export default App;
