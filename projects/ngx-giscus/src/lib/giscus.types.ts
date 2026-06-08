export type GiscusMapping =
  | 'url'
  | 'title'
  | 'og:title'
  | 'specific'
  | 'number'
  | 'pathname';

export type GiscusInputPosition = 'top' | 'bottom';

export type GiscusLoading = 'lazy' | 'eager';

export type GiscusTheme =
  | 'light'
  | 'light_high_contrast'
  | 'light_protanopia'
  | 'light_tritanopia'
  | 'dark'
  | 'dark_high_contrast'
  | 'dark_protanopia'
  | 'dark_tritanopia'
  | 'dark_dimmed'
  | 'preferred_color_scheme'
  | 'transparent_dark'
  | 'noborder_light'
  | 'noborder_dark'
  | 'noborder_gray'
  | 'cobalt'
  | 'purple_dark'
  | string;
