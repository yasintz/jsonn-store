import React from 'react';
import { hydrate } from 'react-dom';
import App from './app';
import { EditorContextProvider } from './context/editor';

const { PAGE_PROPS, PAGE_TYPE } = window;

hydrate(
  <EditorContextProvider initialValue={PAGE_PROPS}>
    <App {...PAGE_PROPS} type={PAGE_TYPE} />
  </EditorContextProvider>,

  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
