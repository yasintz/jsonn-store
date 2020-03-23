import React from 'react';
import { AfterRoot, AfterStyles, AfterScripts, AfterData, DocumentProps } from '@jaredpalmer/after';

import { ServerStyleSheet } from 'styled-components';

export default class Document extends React.Component<DocumentProps & { styleTags: any }> {
  static async getInitialProps({ assets, renderPage }: any) {
    const sheet = new ServerStyleSheet();

    const page = await renderPage((App: any) => (props: any) => sheet.collectStyles(<App {...props} />));

    const styleTags = sheet.getStyleElement();

    return { assets, ...page, styleTags };
  }

  render() {
    const { helmet, styleTags } = this.props;
    // get attributes from React Helmet
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();

    return (
      // eslint-disable-next-line
      <html {...htmlAttrs}>
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <title>Hi, Welcome to the Afterparty</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          <script src="/socket.io/socket.io.js" />
          {styleTags}
          <AfterStyles />
        </head>
        <body {...bodyAttrs}>
          <AfterRoot />
          <AfterData />
          <AfterScripts />
        </body>
      </html>
    );
  }
}
