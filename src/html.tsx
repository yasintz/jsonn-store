import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

interface HtmlProps {
  sources?: string;
  app: React.ReactElement;
}

function importFiles() {
  // eslint-disable-next-line
  const assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
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

function html({ app, sources }: HtmlProps) {
  const sheet = new ServerStyleSheet();
  const markup = renderToString(sheet.collectStyles(app));
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
             ${sources || ''}
             ${importFiles()}
          </head>
          <body>
            <div id="root">${markup}</div>
          </body>
        </html>`;
}

export default html;
