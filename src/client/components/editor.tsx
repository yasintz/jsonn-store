import React from 'react';
import styled from '~/client/styled';

const StyledEditor = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 8px;
  :hover {
  }
`;

interface EditorProps {}

const EDITOR_ID = 'baang5afx';

function Editor(props: React.PropsWithChildren<EditorProps>) {
  React.useEffect(() => {
    const aceEditor = window.Ace.edit(EDITOR_ID);
    aceEditor.setOptions({
      highlightActiveLine: true,
      showPrintMargin: false,
      theme: 'ace/theme/monokai',
      mode: 'ace/mode/json',
      readOnly: true,
    });
  });

  return <StyledEditor id={EDITOR_ID}>{props.children}</StyledEditor>;
}

export default React.memo(Editor);
