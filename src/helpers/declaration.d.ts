import { PageProps } from '.';

declare module '*.jpg';
declare module '*.png';
declare module '*.svg';

declare interface IProblemSolver {}

declare interface Window {
  MyNamespace: any;
  PAGE_PROPS: PageProps;
  PAGE_TYPE: any;
  CSS: Record<string, string>;
  Ace: AceAjax.Ace;
}
