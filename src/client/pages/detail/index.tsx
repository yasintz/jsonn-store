import React from 'react';
import Container from '~/client/components/container';
import styled from '~/client/styled';
import Editor from '~/client/components/editor';
import UILink from '~/client/components/link';
import { BavenIcon, ContractIcon } from '~/client/assets/icons';
import createPage from '../create-page';
import { numberWithCommas } from '~/client/utils';
import { withEditorContext } from '~/client/context/editor';

interface DetailProps {
  db: any;
  count: number;
}

const StyledBottomWrapper = styled.div`
  display: flex;
  margin-top: 24px;
  justify-content: space-between;
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

const Detail: React.SFC<DetailProps> = props => {
  return (
    <Container>
      <Editor isReadOnly>{JSON.stringify(props.db, null, 4)}</Editor>
      <StyledBottomWrapper>
        <UILink href="/">+ Create New Json</UILink>
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

export default createPage(withEditorContext(Detail), async ({ match, privateRoute, redirect }) => {
  const db = await privateRoute('get-db', (match?.params as any).id);
  const count = await privateRoute('get-count');
  if (db) {
    return { db: db.json, count };
  }

  return redirect('/');
});
