import React from 'react';
import Markdown from 'react-markdown';
// @ts-ignore
import renderers from 'react-markdown-github-renderers';
import styled from '~/client/styled';
import Sidebar from './sidebar';
import createPage from '../create-page';

interface Props {
  docs: { id: string; title: string; content: string }[];
}

const Container = styled.div`
  max-width: 1272px;
  margin: auto;
  margin-top: 32px;
  display: flex;
`;

function Doc({ docs }: Props) {
  return (
    <Container>
      <Sidebar items={docs} />
      <div>
        {docs.map(({ id, content }, index) => (
          <div key={id}>
            <div id={id} />
            <Markdown source={content} escapeHtml={false} renderers={renderers} />
          </div>
        ))}
      </div>
    </Container>
  );
}

export default createPage(Doc, async ({ privateRoute }) => {
  const docs = await privateRoute('get-docs');

  return { docs };
});
