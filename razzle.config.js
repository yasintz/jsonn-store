'use strict';
const path = require('path');
const razzleHeroku = require('razzle-heroku');

module.exports = {
  plugins: [
    {
      name: 'typescript',
      options: {
        useBabel: true,
        useEslint: true,
        forkTsChecker: {
          tsconfig: './tsconfig.json',
          tslint: undefined,
          watch: './src',
          typeCheck: true,
        },
      },
    },
  ],
  modify: (config, { target, dev }, webpack) => {
    config = razzleHeroku(config, { target, dev }, webpack);
    config.resolve['alias'] = {
      '~': path.resolve('./src'),
    };
    config.devtool = dev ? 'eval-source-map' : 'none';

    return config;
  },
};
