import { css as styledCss, keyframes as styledKeyframes } from 'styled-components';
import cx from 'classnames';
import { makeid } from '~/utils';
import { ExpressTypes } from '.';
import { isServer } from '../utils';

interface Styles {
  minCss: string;
  css: string;
  className: string;
}

type CssExpressionType = (string | number)[];

const styles: Styles[] = [];
const globals: string[] = [];

function minifyCss(c: string) {
  return c
    .replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, ' ')
    .replace(/\s+/g, ' ')
    .replace(/(\r\n|\n|\r)/gm, ' ');
}

function cssToString(_styles: TemplateStringsArray, ...args: CssExpressionType) {
  let mergedCss = '';
  _styles.forEach((_css, index) => {
    mergedCss += _css + (args[index] || '');
  });

  return mergedCss;
}

function css(_styles: TemplateStringsArray, ...args: CssExpressionType) {
  const _css = cssToString(_styles, ...args);

  if (isServer()) {
    const className = makeid(8);
    styles.push({ className, minCss: minifyCss(_css), css: _css });

    return className;
  }

  return window.CSS[_css];
}

function globalCss(_styles: TemplateStringsArray, ...args: CssExpressionType) {
  globals.push(cssToString(_styles, ...args));
}

function keyframes(_styles: TemplateStringsArray, ...args: CssExpressionType) {
  // eslint-disable-next-line
  const _keyframe = styledKeyframes(_styles, ...args) as any;
  const _keyframeCss = _keyframe.rules.join('');

  globals.push(_keyframeCss);

  return _keyframe.getName();
}

css.styled = styledCss;
css.global = globalCss;
css.cx = cx;
css.keyframes = keyframes;

const getStyleContent = () => `
${styles.map(style => `.${style.className}{${style.minCss}}`).join('')}
${globals.join('\n')}
`;

const getStyles = () => styles;

// eslint-disable-next-line
// @ts-ignore
const _css: {
  (_styles: TemplateStringsArray, ...args: ExpressTypes[]): string;
  styled: typeof styledCss;
  global: typeof globalCss;
  keyframes: typeof keyframes;
  cx: typeof cx;
} = css;

export { _css as css, getStyleContent, getStyles };
