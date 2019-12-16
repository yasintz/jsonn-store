import React from 'react';

interface EditorContextProviderProps {
  initialValue: string;
}
interface EditorContext {
  value: string;
  setValue: (v: string) => void;
}

const initialContextValue: EditorContext = {
  setValue: () => {},
  value: '',
};

const EditorContext = React.createContext<EditorContext>(initialContextValue);

const EditorContextProvider = (props: React.PropsWithChildren<EditorContextProviderProps>) => {
  const [value, setValue] = React.useState(props.initialValue);

  return <EditorContext.Provider value={{ setValue, value }}>{props.children}</EditorContext.Provider>;
};

const useEditorContext = () => React.useContext(EditorContext);

export { useEditorContext, EditorContextProvider };
