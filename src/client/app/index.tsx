import React from 'react';
import { PageContext } from '~/helpers';

import '~/client/assets/style/app.css';
import Doc from '../pages/doc';
import Home from '../pages/home';
import Detail from '../pages/detail';

interface AppProps {
  pageContext?: PageContext;
  items?: { id: string; title: string; content: string }[];
  type: 'doc' | 'app';
}

const App: React.SFC<AppProps> = props => {
  if (props.type === 'doc' && props.items) {
    return <Doc items={props.items} />;
  }

  if (props.pageContext && props.type === 'app') {
    if (props.pageContext.mode === 'view' && props.pageContext.database) {
      return <Detail db={props.pageContext.database} count={props.pageContext.jsonCount} />;
    }

    return <Home count={props.pageContext.jsonCount} />;
  }

  return <div>Undefined</div>;
};

export default App;
