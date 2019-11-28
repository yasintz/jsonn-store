import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { RouteType } from '~/server/helpers';
import App from '~/client/app';
import { AppContext } from '~/helpers';

let assets: any;

const syncLoadAssets = () => {
  // eslint-disable-next-line
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};
syncLoadAssets();

function importFiles() {
  const css = assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : '';
  const js =
    process.env.NODE_ENV === 'production'
      ? `<script src="${assets.client.js}" defer></script>`
      : `<script src="${assets.client.js}" defer crossorigin></script>`;

  return `
      ${css}
      ${js}
      `;
}
function template(context?: AppContext | null, hasError?: boolean) {
  const sheet = new ServerStyleSheet();
  // @ts-ignore
  const markup = renderToString(sheet.collectStyles(<App pageContext={context} />));
  const styleTags = sheet.getStyleTags();

  const title = 'Jsonn.Store';
  const iconUrl =
    'https://user-images.githubusercontent.com/36041339/69496155-1cfc9580-0ee0-11ea-810e-ef60a567b708.png';

  return `<!doctype html>
        <html lang="">
          <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet='utf-8' />
            <title>${title}</title>
             <link rel="icon" href="${iconUrl}" />
            <meta name="viewport" content="width=device-width, initial-scale=1">
             <script src="/socket.io/socket.io.js"></script>
            ${styleTags}
            ${importFiles()}
            <script>
              window.PAGE_CONTEXT=${JSON.stringify(context)};
            </script>
          </head>
          <body>
            <div id="root">${markup}</div>
          </body>
        </html>`;
}

const homeRoute: RouteType = (path, app, { db }) => {
  app.get(`/`, async (req, res) => {
    const { id: databaseId } = req.query;
    try {
      const allJsons = await db.Json.getAllThePublic();
      const currentDabaase = allJsons.find(jsonDb => jsonDb.id === databaseId);
      if (databaseId && currentDabaase) {
        const context: AppContext = {
          jsonCount: allJsons.length,
          mode: 'view',
          database: {},
        };
        res.send(template(context));
      } else {
        const context: AppContext = {
          database: {},
          jsonCount: allJsons.length,
          mode: 'create',
        };
        res.send(template(context));
      }
    } catch (error) {
      res.send(template(null, true));
    }
  });
};

export default homeRoute;
