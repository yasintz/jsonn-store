import React from 'react';
import styled from '~/client/styled';

const StyledWrapper = styled.button``;

interface ButtonProps {}

function UIButton(props: React.PropsWithChildren<ButtonProps>) {
  return <StyledWrapper>{props.children}</StyledWrapper>;
}

export default React.memo(UIButton);
