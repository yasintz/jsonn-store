import React from 'react';
import Home from './home';
import '~/client/assets/style/app.css';
import { AppContext } from '~/helpers';

interface AppProps {
  pageContext: AppContext;
}
const App: React.SFC<AppProps> = props => {
  // const socketIo = React.useRef(isServer() ? {} : io()).current; // eslint-disable-line
  // React.useEffect(() => {
  //   socketIo.on('new-message', (message: any) => {
  //     console.log({ message });
  //   });
  // }, []);

  return (
    <>
      <Home />
    </>
  );
};

export default App;
