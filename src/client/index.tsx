import React from 'react';
import { hydrate } from 'react-dom';
import App from './app';

const { PAGE_PROPS, PAGE_TYPE } = window;

hydrate(<App {...PAGE_PROPS} type={PAGE_TYPE} />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
