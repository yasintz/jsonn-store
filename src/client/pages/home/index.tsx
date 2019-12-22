import React from 'react';
import axios from 'axios';
import styled, { mixins } from '~/client/styled';
import Editor from '~/client/components/editor';
import UIButton from '~/client/components/button';
import Container from '~/client/components/container';
import { BavenIcon, ContractIcon } from '~/client/assets/icons';
import UILink from '~/client/components/link';
import createPage from '../create-page';
import { useEditorContext, withEditorContext } from '~/client/context/editor';
import { numberWithCommas } from '~/client/utils';

interface AppProps {
  count: number;
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

const App: React.SFC<AppProps> = props => {
  const editorContext = useEditorContext();

  return (
    <Container>
      <Editor />
      <StyledBottomWrapper>
        <StyledButtonWrapper>
          <UIButton
            onClick={() => {
              axios.post('/json', { data: editorContext.getJsonValue() }).then(({ data }) => {
                // eslint-disable-next-line
                location.href = data.view;
              });
            }}
          >
            Create Json
          </UIButton>
          <UIButton onClick={editorContext.atachPretty}> Pretty Json</UIButton>
        </StyledButtonWrapper>
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

export default createPage(withEditorContext(App), async ({ match, query, privateRoute }) => {
  const count = await privateRoute('get-count');

  return { count };
});
