import React from 'react';
import { PageContext } from '~/helpers';
import Template from '~/client/components/template';
import { css } from '~/client/styled';

interface DetailProps {
  db: PageContext['database'];
  count: number;
}
const customcss = css`
  color: red;
`;

const Detail: React.SFC<DetailProps> = props => {
  return <Template count={props.count} page="detail" db={props.db} />;
};

export default Detail;

/*

abcde // 5 elemanli enson index 4

3 karakterli bir id

*/
