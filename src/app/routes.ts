export const routes = {
  home: 'home',
  characterSelect: 'characterSelect',
  collection: 'collection',
  game: 'game',
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
