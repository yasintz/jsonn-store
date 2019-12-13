import React from 'react';
import { RouteType } from '~/server/helpers';
import App from '~/client/app';
import { PageContext } from '~/helpers';
import { JsonUserRole } from '~/server/database/models/user-json';
import html from '~/html';

function template(context: PageContext, hasError?: boolean) {
  const todoRefactor = `
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

  return html({
    app: <App pageContext={context} />,
    sources: `
             <script>
              window.PAGE_PROPS=${JSON.stringify({ pageContext: context })};
              windows.PAGE_TYPE='doc';
            </script>
             ${todoRefactor}
  
  `,
  });
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
