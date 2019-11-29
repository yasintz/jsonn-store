import React from 'react';
import { PageContext } from '~/helpers';

import '~/client/assets/style/app.css';
import styled from '../styled';

interface AppProps {
  pageContext: PageContext;
}
const Editor = styled.div`
  position: absolute;
  top: 110px;
  left: 0;
  right: 0;
  bottom: 10px;
`;
const App: React.SFC<AppProps> = props => {
  if (props.pageContext.mode === 'view' && props.pageContext.database) {
    return (
      <div>
        <p> Json Count : {props.pageContext.jsonCount} </p>
        <Editor id="editor">{JSON.stringify(props.pageContext.database.json, null, 4)}</Editor>
      </div>
    );
  }

  return <textarea />;
};

export default App;
