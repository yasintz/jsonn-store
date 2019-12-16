import React from 'react';
import Template from '~/client/components/template';
import createPage from '../create-page';

interface DetailProps {
  db: any;
  count: number;
}

const Detail: React.SFC<DetailProps> = props => {
  return <Template count={props.count} page="detail" db={props.db} />;
};

export default createPage(Detail, async ({ match, privateRoute, redirect }) => {
  const db = await privateRoute('get-db', (match?.params as any).id);
  const count = await privateRoute('get-count');
  if (db) {
    return { db, count };
  }

  return redirect('/');
});
