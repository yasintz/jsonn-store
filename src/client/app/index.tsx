import React from 'react';
import { Switch, Route } from 'react-router-dom';

import '~/client/assets/style/app.css';
import routes from '../pages';
import { EditorContextProvider } from '../context/editor';

interface AppProps {
  initialData: any[];
}

const App: React.SFC<AppProps> = props => {
  return (
    <EditorContextProvider initialValue="">
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
                  ...(props.initialData[index] || null),
                })
              }
            />
          );
        })}
      </Switch>
    </EditorContextProvider>
  );
};

export default App;
