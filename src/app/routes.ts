export const routes = {
  home: 'home',
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
