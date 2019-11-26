import React from 'react';
import { Express } from 'express';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import App from '~/client/app';
import { getAllJson } from '~/server/database/functions';
import { numberWithCommas } from '~/server/utils';
import { generateApiLink } from '~/server/utils/link';

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

const iconUrl = 'https://user-images.githubusercontent.com/36041339/69496155-1cfc9580-0ee0-11ea-810e-ef60a567b708.png';

export default (app: Express) => {
  app.get(`/`, async (req, res) => {
    const originUrl = new URL('api/json', `${req.protocol}://${req.get('host')}${req.originalUrl}`).origin;
    try {
      const allJsons = await getAllJson();
      const context = {
        iconUrl,
        postUrl: generateApiLink(req),
        originUrl: `${originUrl}/json`,
        jsonCount: numberWithCommas(allJsons.length),
        isReadOnly: false,
        app: {
          name: {
            text: 'Jsonn',
            full: 'Jsonn.Store',
            highlighted: '.Store',
          },
        },
      };
      const sheet = new ServerStyleSheet();
      const markup = renderToString(sheet.collectStyles(<App pageContext={{}} />));
      const styleTags = sheet.getStyleTags();
      res.send(
        `<!doctype html>
        <html lang="">
          <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet='utf-8' />
            <title>Razzle TypeScript 2</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${styleTags}
            ${importFiles()}
            <script>
              window.PAGE_CONTEXT=${JSON.stringify(context)} 
            </script>
          </head>
          <body>
            <div id="root">${markup}</div>
          </body>
        </html>`,
      );
    } catch (error) {
      // TODO: send error html
      res.send({ error });
    }
  });
};
