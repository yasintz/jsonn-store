import React from 'react';
import styled from '~/client/styled';
import { useEditorContext } from '../context/editor';

const StyledEditor = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 8px;
  :hover {
  }
`;

interface EditorProps {
  isReadOnly: boolean;
}

const EDITOR_ID = 'ace_editor';

function Editor(props: React.PropsWithChildren<EditorProps>) {
  const editorContext = useEditorContext();
  const aceEditor = React.useRef<AceAjax.Editor>();
  React.useEffect(() => {
    aceEditor.current = window.ace.edit(EDITOR_ID);
    aceEditor.current.setOptions({
      highlightActiveLine: true,
      showPrintMargin: false,
      theme: 'ace/theme/monokai',
      mode: 'ace/mode/json',
      readOnly: props.isReadOnly,
    });
  }, [props.isReadOnly]);

  React.useEffect(() => {
    if (aceEditor.current && editorContext.pretty) {
      try {
        aceEditor.current.setValue(JSON.stringify(JSON.parse(aceEditor.current.getValue()), null, 4));
        // eslint-disable-next-line
      } catch (error) {}
    }
  }, [editorContext.pretty, editorContext.value]);

  return <StyledEditor id={EDITOR_ID}>{props.children}</StyledEditor>;
}

export default React.memo(Editor);
