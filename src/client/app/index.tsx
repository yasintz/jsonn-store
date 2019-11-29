import React from 'react';
import Home from './home';
import '~/client/assets/style/app.css';
import { AppContext } from '~/helpers';
import { isServer } from '../utils';

interface AppProps {
  pageContext: AppContext;
}
const App: React.SFC<AppProps> = props => {
  // eslint-disable-next-line
  // @ts-ignore
  const socketIo = React.useRef(isServer() ? {} : io()).current; // eslint-disable-line
  React.useEffect(() => {
    socketIo.on('messages-yasin', (message: any) => {});
    socketIo.on('osman', (message: any) => {});
  }, []);

  return (
    <>
      <Home />
    </>
  );
};

export default App;
