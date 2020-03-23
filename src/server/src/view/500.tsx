/* eslint-disable global-require  */
import React from 'react';
import Helmet from 'react-helmet';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import ServerErrorJsx from '@client/pages/server-error';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST!); // eslint-disable-line
let html: string;

function loadGlobalCss(): string {
  if (process.env.NODE_ENV === 'development') {
    const cssContent = require('fs').readFileSync(
      require('path').join(process.cwd(), 'src', 'client', 'src', 'assets', 'style', 'app.css'),
      'UTF-8',
    );

    return `<style>${cssContent}</style>`;
  }

  return assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : '';
}

function get500Html() {
  if (html && process.env.NODE_ENV !== 'development') {
    return html;
  }

  const sheet = new ServerStyleSheet();
  const body = renderToString(sheet.collectStyles(<ServerErrorJsx />));
  const helmet = Helmet.renderStatic();
  const styleTags = sheet.getStyleTags();

  html = `
   <!doctype html>
   <html>
      <head>
        ${helmet.title.toString().trim()}
        ${helmet.meta.toString().trim()}
        ${helmet.link.toString().trim()}
        ${styleTags}
        ${loadGlobalCss()}
     </head>
      <body>
      ${body}
      <script>
      </body>
    </html>
  `;

  return html;
}

export default get500Html;
