import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import App from './client/app';
import { getStyles, getStyleContent } from './client/styled/css';

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

function html(props: any, url: string) {
  const app = (
    <StaticRouter location={url}>
      <App {...(props as any)} />
    </StaticRouter>
  );
  const sheet = new ServerStyleSheet();
  const markup = renderToString(sheet.collectStyles(app));
  const styleTags = sheet.getStyleTags();
  const title = 'Jsonn.Store';

  const iconUrl =
    'https://user-images.githubusercontent.com/36041339/69496155-1cfc9580-0ee0-11ea-810e-ef60a567b708.png';

  const cssObj = {};
  getStyles().forEach(item => {
    cssObj[item.css] = item.className;
  });

  return `<!doctype html>
        <html lang="">
          <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet='utf-8' />
            <title>${title}</title>
             <link rel="icon" href="${iconUrl}" />
             <meta name="viewport" content="width=device-width, initial-scale=1">
             <style>${getStyleContent()}</style>
             <script src="/socket.io/socket.io.js"></script>
             <script
               src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.6/ace.js"
               integrity="sha256-CVkji/u32aj2TeC+D13f7scFSIfphw2pmu4LaKWMSY8="
               crossorigin="anonymous"
             ></script> 
             ${styleTags}
            <script>
                window.PAGE_PROPS = ${JSON.stringify(props)};
                window.CSS = ${JSON.stringify(cssObj)};
                window.Ace = ace;
            </script>
             ${importFiles()}
          </head>
          <body>
            <div id="root">${markup}</div>
          </body>
        </html>`;
}

export default html;
