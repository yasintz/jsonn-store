import React from 'react';
import { PageComponent } from '..';

interface AppProps {}

const App: PageComponent<AppProps> = props => {
  return (
    <div>
      <div>
        <a href="/auth/login/google"> Login With Google</a>
      </div>
    </div>
  );
};

App.getInitialProps = ({ req }) => {
  return {};
};

export default App;
