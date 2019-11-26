module.exports = {
  presets: ['razzle/babel'],
  plugins: [
    [
      'babel-plugin-styled-components',
      {
        displayName: true,
        fileName: true,
      },
    ],
  ],
};
