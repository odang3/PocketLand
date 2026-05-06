export const routes = {
  home: 'home',
  characterSelect: 'characterSelect',
  difficultySelect: 'difficultySelect',
  collection: 'collection',
  game: 'game',
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
