import React from 'react';
import Home from './home';
import '~/client/assets/style/app.css';

interface AppContext {}

interface AppProps {
  pageContext: AppContext;
}

const App: React.SFC<AppProps> = () => <Home />;

export default App;
