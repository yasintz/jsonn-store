import React from 'react';
import { PageProps } from '~/helpers';
import Container from '~/client/components/container';
import Editor from '~/client/components/editor';
import UIButton from '~/client/components/button';
import styled, { mixins } from '~/client/styled';
import { BavenIcon } from '~/client/assets/icons';
import { numberWithCommas } from '~/server/utils';

interface TemplateProps {
  db?: PageProps['database'];
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

const StyledLink = styled.a`
  text-decoration: none;
  color: #4f89df;
  :hover {
    color: #3b6cb5;
  }
`;

const Template: React.SFC<TemplateProps> = props => {
  const element =
    props.page === 'create' ? (
      <>
        <UIButton>Create Json</UIButton>
        <UIButton>Pretty Json</UIButton>
      </>
    ) : (
      <StyledLink href="/">+ Create New Json</StyledLink>
    );

  return (
    <Container>
      <Editor>{props.page === 'detail' ? JSON.stringify(props.db, null, 4) : null}</Editor>
      <StyledBottomWrapper>
        <StyledButtonWrapper>{element}</StyledButtonWrapper>
        <StyledJsonCountText>{numberWithCommas(props.count)} Jsonn Stored</StyledJsonCountText>
      </StyledBottomWrapper>
      <StyledIconWrapper>
        <StyledBavenIcon />
      </StyledIconWrapper>
    </Container>
  );
};

export default Template;
