import React from 'react';
import styled from '~/client/styled';

const StyledWrapper = styled.button``;

interface ButtonProps {
  onClick: () => void;
}

function UIButton(props: React.PropsWithChildren<ButtonProps>) {
  return <StyledWrapper onClick={props.onClick}>{props.children}</StyledWrapper>;
}

export default React.memo(UIButton);
