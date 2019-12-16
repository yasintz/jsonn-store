import React from 'react';

interface EditorContextProviderProps {
  initialValue: string;
}
interface EditorContext {
  value: string;
  setValue: (v: string) => void;
  pretty: boolean;
  atachPretty: () => void;
}

const initialContextValue: EditorContext = {
  setValue: () => {},
  pretty: false,
  atachPretty: () => {},
  value: '',
};

const EditorContext = React.createContext<EditorContext>(initialContextValue);

const EditorContextProvider = (props: React.PropsWithChildren<EditorContextProviderProps>) => {
  const [value, setValue] = React.useState(props.initialValue);
  const [pretty, setPretty] = React.useState(false);

  React.useEffect(() => {
    if (pretty) {
      setPretty(false);
    }
  }, [pretty]);

  return (
    <EditorContext.Provider
      value={{
        setValue,
        value,
        pretty,
        atachPretty: () => {
          setPretty(true);
        },
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
};

const useEditorContext = () => React.useContext(EditorContext);

export { useEditorContext, EditorContextProvider };
