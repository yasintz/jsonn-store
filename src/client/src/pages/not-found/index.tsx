import React from 'react';
import { PageComponent } from '..';

const NotFound: PageComponent = () => {
  return <h2>404 </h2>;
};

NotFound.getInitialProps = ({ req, res }) => {
  return {};
};

export default NotFound;
