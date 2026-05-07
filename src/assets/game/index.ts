import homeSkyBg from './backgrounds/home-sky-bg.webp';
import fantasyIslandStage from './backgrounds/fantasy-island-stage.webp';
import cloudLeft from './backgrounds/cloud-left.webp';
import cloudRight from './backgrounds/cloud-right.webp';
import castleLeft from './backgrounds/castle-left.webp';
import castleRight from './backgrounds/castle-right.webp';
import balloonPink from './backgrounds/balloon-pink.webp';
import balloonBlue from './backgrounds/balloon-blue.webp';

import ddangnyangi from './characters/ddangnyangi.webp';
import malangJelly from './characters/malang-jelly.webp';
import penguinKong from './characters/penguin-kong.webp';
import purpleEnemy from './characters/purple-enemy.webp';
import hamsterCaptain from './characters/hamster-captain.webp';
import ghostCat from './characters/ghost-cat.webp';
import babyDragon from './characters/baby-dragon.webp';

import coinPaw from './icons/coin-paw.webp';
import trophy from './icons/trophy.webp';
import rewardChest from './icons/reward-chest.webp';
import territoryFlag from './icons/territory-flag.webp';
import paw from './icons/paw.webp';

import sparkle from './ui/sparkle.webp';

export const gameBackgrounds = {
  homeSky: homeSkyBg,
  fantasyIslandStage,
  cloudLeft,
  cloudRight,
  castleLeft,
  castleRight,
  balloonPink,
  balloonBlue,
} as const;

export const gameCharacters = {
  ddangnyangi,
  malangJelly,
  penguinKong,
  purpleEnemy,
  hamsterCaptain,
  ghostCat,
  babyDragon,
} as const;

export const gameIcons = {
  coinPaw,
  trophy,
  rewardChest,
  territoryFlag,
  paw,
} as const;

export const gameUi = {
  sparkle,
} as const;
