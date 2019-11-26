'use strict';
const path = require('path');

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
  modify: (config, { target, dev }) => {
    config.resolve['alias'] = {
      '~': path.resolve('./src'),
    };

    return config;
  },
};
