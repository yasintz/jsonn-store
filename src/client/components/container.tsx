import React from 'react';
import styled, { mixins } from '~/client/styled';

const StyledContainer = styled.div`
  max-width: 1016px;
  width: 100%;
  margin: auto;
  margin-top: 80px;
  padding: 0 8px;
  ${mixins.mediaBreakpointDown('desktop')} {
    max-width: 816px;
  }
`;

const StyledWrapper = styled.div`
  width: calc(100% - 16px);
`;

export default React.memo(props => (
  <StyledContainer>
    <StyledWrapper>{props.children}</StyledWrapper>
  </StyledContainer>
));
