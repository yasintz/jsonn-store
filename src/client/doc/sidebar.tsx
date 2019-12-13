import React from 'react';
import styled from '~/client/styled';

interface Props {
  items: { id: string; title: string }[];
}

const SidebarContainer = styled.div`
  position: sticky;
  top: 48px;
  height: 100%;
  margin-right: 96px;
  width: 18%;
  border: 2px solid #ddd;
  padding: 8px;
`;

function Sidebar({ items }: Props) {
  return (
    <SidebarContainer>
      {items.map(({ id, title }) => (
        <div key={id + title}>
          <a href={`#${id}`}>{title}</a>
        </div>
      ))}
    </SidebarContainer>
  );
}

export default Sidebar;
