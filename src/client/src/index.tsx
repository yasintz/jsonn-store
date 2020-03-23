import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import routes from '@client/pages';
import { After } from '@jaredpalmer/after';

const Client: React.FC<{ data: any }> = ({ data }) => {
  return (
    <BrowserRouter>
      <After data={data} routes={routes} />
    </BrowserRouter>
  );
};

export default Client;
