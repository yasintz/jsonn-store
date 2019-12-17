import React from 'react';
import styled from '~/client/styled';
import { useEditorContext } from '../context/editor';
import { EDITOR_ID } from '../utils/constants';

const StyledEditor = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 8px;
  :hover {
  }
`;

interface EditorProps {
  isReadOnly?: boolean;
}

function Editor(props: React.PropsWithChildren<EditorProps>) {
  const editorContext = useEditorContext();
  React.useEffect(() => {
    if (editorContext.editor && editorContext.pretty) {
      try {
        editorContext.editor.setValue(JSON.stringify(editorContext.getJsonValue(), null, 4));
        // eslint-disable-next-line
      } catch (error) {}
    }
  }, [editorContext]);
  React.useEffect(() => {
    if (props.isReadOnly) {
      // eslint-disable-next-line
      editorContext.editor?.setOption('readOnly', true);
    }
  }, [props.isReadOnly, editorContext.editor]);

  return <StyledEditor id={EDITOR_ID}>{props.children}</StyledEditor>;
}

export default React.memo(Editor);
