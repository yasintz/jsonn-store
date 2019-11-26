import { StaticColorType } from '~/helpers/static-types';

// eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
const themeOptions = require('../../statics/theme.json');

const allThemes = Object.keys(themeOptions.themes);
const theme = (() => {
  const themeFromLocalStorage = localStorage.getItem('theme');
  if (!themeFromLocalStorage) {
    return themeOptions.defaultTheme;
  }
  if (allThemes.includes(themeFromLocalStorage)) {
    return themeFromLocalStorage;
  }

  return themeOptions.defaultTheme;
})();
const colors: StaticColorType = themeOptions.themes[theme];

function setTheme(t: string) {
  if (allThemes.includes(t)) {
    localStorage.setItem('theme', t);
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }
}

export { colors, setTheme };
