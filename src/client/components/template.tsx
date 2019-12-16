import React from 'react';
import axios from 'axios';
import Container from '~/client/components/container';
import Editor from '~/client/components/editor';
import UIButton from '~/client/components/button';
import styled, { mixins } from '~/client/styled';
import { BavenIcon, ContractIcon } from '~/client/assets/icons';
import { numberWithCommas } from '../utils';
import UILink from './link';
import { useEditorContext } from '../context/editor';

interface TemplateProps {
  db?: any;
  count: number;
  page: 'detail' | 'create';
}

const StyledBottomWrapper = styled.div`
  display: flex;
  margin-top: 24px;
  justify-content: space-between;
  ${mixins.mediaBreakpointDown('tablet')} {
    flex-direction: column;
  }
`;

const StyledButtonWrapper = styled.div`
  display: flex;
  ${mixins.mediaBreakpointDown('tablet')} {
    flex-direction: column;
  }
`;

const StyledIconWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
`;

const StyledBavenIcon = styled(BavenIcon)`
  margin: auto;
`;

const StyledJsonCountText = styled.span`
  text-align: center;
`;

const StyledApiLink = styled(UILink)`
  font-size: 16px;
`;
const StyledApiLinkWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledContractIcon = styled(ContractIcon)`
  display: inline-block;
  width: 16px;
  height: 16px;
  color: #4f89df;
`;

const Template: React.SFC<TemplateProps> = props => {
  const editorContext = useEditorContext();
  const element =
    props.page === 'create' ? (
      <>
        <UIButton onClick={() => {}}>Create Json</UIButton>
        <UIButton onClick={editorContext.atachPretty}> Pretty Json</UIButton>
      </>
    ) : (
      <UILink href="/">+ Create New Json</UILink>
    );

  return (
    <Container>
      <Editor isReadOnly={props.page === 'detail'}>
        {props.page === 'detail' ? JSON.stringify(props.db, null, 4) : null}
      </Editor>
      <StyledBottomWrapper>
        <StyledButtonWrapper>{element}</StyledButtonWrapper>
        <StyledJsonCountText>{numberWithCommas(props.count)} Jsonn Stored</StyledJsonCountText>
      </StyledBottomWrapper>
      <StyledIconWrapper>
        <StyledBavenIcon />
      </StyledIconWrapper>
      <StyledApiLinkWrapper>
        <StyledContractIcon />
        <StyledApiLink href="/doc">Documentation</StyledApiLink>
      </StyledApiLinkWrapper>
    </Container>
  );
};

export default Template;
