import React from 'react';
import { PageProps } from '~/helpers';
import Template from '~/client/components/template';

interface DetailProps {
  db: PageProps['database'];
  count: number;
}

const Detail: React.SFC<DetailProps> = props => {
  return <Template count={props.count} page="detail" db={props.db} />;
};

export default Detail;

/*

abcde // 5 elemanli enson index 4

3 karakterli bir id

*/
