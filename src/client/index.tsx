import React from 'react';
import { hydrate } from 'react-dom';
import App from './app';

// @ts-ignore
const pageContext = window.PAGE_CONTEXT as any;

hydrate(<App pageContext={pageContext} />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
