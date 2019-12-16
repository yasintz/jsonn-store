import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { hydrate } from 'react-dom';
import App from './app';

// @ts-ignore
const { PAGE_PROPS } = window;

hydrate(
  <BrowserRouter>
    <App {...PAGE_PROPS} />
  </BrowserRouter>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
