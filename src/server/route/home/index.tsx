import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { RouteType } from '~/server/helpers';
import App from '~/client/app';
import { PageContext } from '~/helpers';
import { JsonUserRole } from '~/server/database/models/user-json';

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
function template(context: PageContext, hasError?: boolean) {
  const sheet = new ServerStyleSheet();
  const markup = renderToString(sheet.collectStyles(<App pageContext={context} />));
  const styleTags = sheet.getStyleTags();
  const TODO_refactor = `
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.6/ace.js"
        integrity="sha256-CVkji/u32aj2TeC+D13f7scFSIfphw2pmu4LaKWMSY8="
        crossorigin="anonymous"
    ></script>
  <script>
    window.onload=() =>{
     const editor = ace.edit('editor');
     editor.setOptions({
        highlightActiveLine: true,
        showPrintMargin: false,
        theme: 'ace/theme/monokai',
        mode: 'ace/mode/json',
        readOnly:true,
      });
    }
  </script>
  `;
  const title = 'Jsonn.Store';
  const iconUrl =
    'https://user-images.githubusercontent.com/36041339/69496155-1cfc9580-0ee0-11ea-810e-ef60a567b708.png';

  return `<!doctype html>
        <html lang="">
          <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet='utf-8' />
            <title>${title}</title>
            ${TODO_refactor}
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

const homeRoute: RouteType = (app, { db }) => {
  app.get(`/`, async (req, res) => {
    const { id: databaseId } = req.query;
    try {
      const jsonCount = await db.Json.getCount();
      if (databaseId) {
        const currentDabaase = await db.Json.getJsonById(databaseId);
        if (currentDabaase && currentDabaase.read === JsonUserRole.everyone) {
          const context: PageContext = {
            jsonCount,
            mode: 'view',
            database: {
              id: currentDabaase.id,
              json: currentDabaase.json,
            },
          };
          res.send(template(context));

          return;
        }
      }
      const context: PageContext = {
        jsonCount,
        mode: 'create',
      };
      res.send(template(context));
    } catch (error) {
      // TODO: send error mode
      // res.send(template(null, true));
    }
  });
};

export default homeRoute;
