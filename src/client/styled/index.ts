/* eslint-disable import/no-duplicates,@typescript-eslint/no-explicit-any */
import * as React from 'react';

import _styled, { createGlobalStyle, Keyframes } from 'styled-components';

import { mixins } from './mixins';
import { css, globalStyle } from './css';
import { colors, setTheme } from './theme';

export interface StylableProps {
  className?: string;
}

export type ExpressTypes = string | number | ICSSProperties | Keyframes;

interface ICSSProperties {
  [key: string]: string | number | ICSSProperties;
}

type StyledComponent<T> = React.StatelessComponent<T & { as?: React.ReactType }> & IProblemSolver;

type StyledTag<T> = <Props>(
  strings: TemplateStringsArray,
  ...exprs: (ExpressTypes | ((props: Props) => string | number) | IProblemSolver)[]
) => StyledComponent<Props & T>;

type StyledJSXIntrinsics = {
  readonly [P in keyof JSX.IntrinsicElements]: StyledTag<JSX.IntrinsicElements[P]>;
};

type StyledFunction = <T>(c: React.ReactType<T>) => StyledTag<T>;

type Styled = StyledJSXIntrinsics &
  StyledFunction & {
    readonly [key: string]: StyledTag<{
      children?: React.ReactNode;
      [key: string]: any;
    }>;
  };

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const styled: Styled = _styled as Styled;
const globalStyleCreator = () => createGlobalStyle`${globalStyle()}`;

export { css, createGlobalStyle, mixins, colors, setTheme, globalStyleCreator };

export default styled;
