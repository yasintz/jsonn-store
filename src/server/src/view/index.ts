import { render } from '@jaredpalmer/after';
import document from '@client/document';
import routes from '@client/pages';

interface Props {
  req: any;
  res: any;
}
// eslint-disable-next-line
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);

async function view({ req, res }: Props) {
  const htmlString = await render({
    assets,
    routes,
    document,
    req,
    res,
  });

  return htmlString;
}

export default view;
