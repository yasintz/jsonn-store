import React from 'react';
import { hydrate } from 'react-dom';
import App from './app';
import Doc from './doc';

// eslint-disable-next-line
// @ts-ignore
const pageProps = window.PAGE_PROPS as any;
// eslint-disable-next-line
// @ts-ignore
const pageType = window.PAGE_TYPE as 'doc' | 'editor';

if (pageType === 'doc') {
  hydrate(<Doc {...pageProps} />, document.getElementById('root'));
} else {
  hydrate(<App {...pageProps} />, document.getElementById('root'));
}

if (module.hot) {
  module.hot.accept();
}
