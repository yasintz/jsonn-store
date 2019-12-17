import React from 'react';
import { EDITOR_ID } from '../utils/constants';

interface EditorContextProviderProps {
  initialValue: string;
}
interface EditorContext {
  value: string;
  pretty: boolean;
  editor: AceAjax.Editor | undefined;
  setValue: (v: string) => void;
  getJsonValue: () => any;
  atachPretty: () => void;
  makeReadOnly: () => void;
}

const initialContextValue: EditorContext = {
  pretty: false,
  editor: undefined,
  value: '',
  setValue: () => null,
  getJsonValue: () => null,
  atachPretty: () => null,
  makeReadOnly: () => null,
};

const EditorContext = React.createContext<EditorContext>(initialContextValue);

const EditorContextProvider = (props: React.PropsWithChildren<EditorContextProviderProps>) => {
  const [value, setValue] = React.useState(props.initialValue);
  const [pretty, setPretty] = React.useState(false);
  const [aceEditor, setAceEditor] = React.useState<AceAjax.Editor>();
  React.useEffect(() => {
    const editor = window.ace.edit(EDITOR_ID);

    editor.setOptions({
      highlightActiveLine: true,
      showPrintMargin: false,
      theme: 'ace/theme/monokai',
      mode: 'ace/mode/json',
    });

    setAceEditor(editor);
  }, []);

  React.useEffect(() => {
    if (pretty) {
      setPretty(false);
    }
  }, [pretty]);

  const contexValue = React.useMemo<EditorContext>(
    () => ({
      setValue,
      value,
      pretty,
      makeReadOnly: () => {},
      getJsonValue: () => {
        if (aceEditor) {
          return JSON.parse(aceEditor.getValue());
        }

        return null;
      },
      atachPretty: () => {
        setPretty(true);
      },
      editor: aceEditor,
    }),
    [pretty, value, aceEditor],
  );

  return <EditorContext.Provider value={contexValue}>{props.children}</EditorContext.Provider>;
};

const useEditorContext = () => React.useContext(EditorContext);

const withEditorContext = (Component: any) => (props: any) => (
  <EditorContextProvider initialValue="">
    <Component {...props} />
  </EditorContextProvider>
);

export { useEditorContext, EditorContextProvider, withEditorContext };
