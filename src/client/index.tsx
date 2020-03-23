import React from 'react';
import { hydrate } from 'react-dom';
import { ensureReady } from '@jaredpalmer/after';
import routes from '@client/pages';
import Client from './src';

ensureReady(routes).then(data => hydrate(<Client data={data} />, document.getElementById('root')));

if (module.hot) {
  module.hot.accept();
}
