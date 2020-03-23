/* eslint-disable jsx-a11y/html-has-lang */
import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';

interface ServerErrorProps {}
const StyledTitle = styled.h1`
  color: red;
`;

const ServerError: React.FC<ServerErrorProps> = props => {
  return (
    <div>
      <Helmet title="Hello world" />
      <StyledTitle>Server Error</StyledTitle>
    </div>
  );
};

export default ServerError;
