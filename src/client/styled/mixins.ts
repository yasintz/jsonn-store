export const mediaQueryMixins = {
  maxWidth: (n: string) => `@media (max-width: ${n})`,
  minWidth: (n: string) => `@media (min-width: ${n})`,
  between: (min: string, max: string) => `@media (min-width: ${min}) and (max-width: ${max})`,
};

/**
 * Breakpoints & Media Queries
 */
const tabletBreakpoint = 648;

const desktopBreakpoint = 961;

const desktopWideBreakpoint = 1271;

// Targeting the given screen size or bigger
const mediaBreakpointUp = (device: 'tablet' | 'desktop' | 'desktop-wide') => {
  switch (device) {
    case 'tablet':
      return mediaQueryMixins.minWidth(`${tabletBreakpoint}px`);
    case 'desktop':
      return mediaQueryMixins.minWidth(`${desktopBreakpoint}px`);
    case 'desktop-wide':
      return mediaQueryMixins.minWidth(`${desktopWideBreakpoint}px`);
    default:
      return '';
  }
};

// Targeting the given screen size or smaller
const mediaBreakpointDown = (device: 'mobile' | 'tablet' | 'desktop') => {
  switch (device) {
    case 'mobile':
      return mediaQueryMixins.maxWidth(`${tabletBreakpoint - 1}px`);
    case 'tablet':
      return mediaQueryMixins.maxWidth(`${desktopBreakpoint - 1}px`);
    case 'desktop':
      return mediaQueryMixins.maxWidth(`${desktopWideBreakpoint - 1}px`);
    default:
      return '';
  }
};

// Targeting a single segment of screen sizes
const mediaBreakpointOnly = (device: 'tablet' | 'desktop') => {
  switch (device) {
    case 'tablet':
      return mediaQueryMixins.between(`${tabletBreakpoint}px`, `${desktopBreakpoint - 1}px`);
    case 'desktop':
      return mediaQueryMixins.between(`${desktopBreakpoint}px`, `${desktopWideBreakpoint - 1}px`);
    default:
      return '';
  }
};

const mediaBreakpointBetween = (device1: 'tablet', device2: 'desktop-wide') => {
  let breakpoint1;
  let breakpoint2;

  switch (device1) {
    case 'tablet':
      breakpoint1 = tabletBreakpoint;
      break;
    default:
      return '';
  }
  switch (device2) {
    case 'desktop-wide':
      breakpoint2 = desktopWideBreakpoint;
      break;
    default:
      return '';
  }

  return mediaQueryMixins.between(`${breakpoint1}px`, `${breakpoint2 - 1}px`);
};

const mixins = {
  mediaBreakpointBetween,
  mediaBreakpointDown,
  mediaBreakpointOnly,
  mediaBreakpointUp,
};

export { mixins };
