import type { CSSProperties } from 'react';
import { gameBackgrounds, gameCharacters, gameIcons, gameUi } from '../assets/game';
import type { BestScoreByDifficulty } from '../storage/storage';

const homeCopy = {
  title: 'PocketLand',
  koreanTitle: '포켓랜드',
  subtitle: '귀여운 친구들과 땅 점령!',
  play: '플레이하기',
  collection: '캐릭터 도감',
  mission: '미션 보기',
  missionSoon: '준비중',
  coinsLabel: '보유 코인',
  bestScoreLabel: '최고 점령률',
  bestScoreEmpty: '도전 전',
  todayRewardLabel: '오늘의 보상',
  todayRewardValue: '3일차 보상 대기',
  territoryTipLabel: '오늘의 목표',
  territoryTipValue: '60% 점령 도전',
  mail: '우편',
  event: '이벤트',
  settings: '설정',
};

const homeCharacters = [
  {
    className: 'pocket-home-character--jelly',
    image: gameCharacters.malangJelly,
    name: '말랑젤리',
  },
  {
    className: 'pocket-home-character--cat',
    image: gameCharacters.ddangnyangi,
    name: '땅냥이',
  },
  {
    className: 'pocket-home-character--penguin',
    image: gameCharacters.penguinKong,
    name: '펭귄콩',
  },
] as const;

const dailyRewards = [
  { label: '1일차', icon: gameIcons.coinPaw, amount: 'x100', checked: true },
  { label: '2일차', icon: gameIcons.territoryFlag, amount: 'x10', checked: true },
  { label: '3일차', icon: gameIcons.paw, amount: 'x2', checked: false },
  { label: '4일차', icon: gameIcons.coinPaw, amount: 'x200', checked: false },
] as const;

type HomePageProps = {
  coins: number;
  bestScoreByDifficulty: BestScoreByDifficulty;
  onPlay: () => void;
  onOpenCollection: () => void;
};

type HomeScreenStyle = CSSProperties & {
  '--pocket-home-bg': string;
};

function formatBestScore(bestScoreByDifficulty: BestScoreByDifficulty) {
  const bestScore = Math.max(
    bestScoreByDifficulty.easy,
    bestScoreByDifficulty.normal,
    bestScoreByDifficulty.hard,
  );

  return bestScore > 0 ? `${bestScore}%` : homeCopy.bestScoreEmpty;
}

export function HomePage({
  coins,
  bestScoreByDifficulty,
  onPlay,
  onOpenCollection,
}: HomePageProps) {
  const bestScore = formatBestScore(bestScoreByDifficulty);
  const screenStyle: HomeScreenStyle = {
    '--pocket-home-bg': `url(${gameBackgrounds.homeSky})`,
  };

  return (
    <main className="pocket-screen pocket-home-screen" style={screenStyle}>
      <img
        className="game-deco pocket-home-deco pocket-home-deco--cloud-left"
        src={gameBackgrounds.cloudLeft}
        alt=""
        aria-hidden="true"
      />
      <img
        className="game-deco pocket-home-deco pocket-home-deco--cloud-right"
        src={gameBackgrounds.cloudRight}
        alt=""
        aria-hidden="true"
      />
      <img
        className="game-deco pocket-home-deco pocket-home-deco--balloon-pink"
        src={gameBackgrounds.balloonPink}
        alt=""
        aria-hidden="true"
      />
      <img
        className="game-deco pocket-home-deco pocket-home-deco--balloon-blue"
        src={gameBackgrounds.balloonBlue}
        alt=""
        aria-hidden="true"
      />
      <img
        className="game-deco pocket-home-deco pocket-home-deco--sparkle-one"
        src={gameUi.sparkle}
        alt=""
        aria-hidden="true"
      />
      <img
        className="game-deco pocket-home-deco pocket-home-deco--sparkle-two"
        src={gameUi.sparkle}
        alt=""
        aria-hidden="true"
      />

      <section className="pocket-home-content" aria-labelledby="home-title">
        <header className="pocket-home-topbar" aria-label="로비 상태">
          <div className="pocket-home-coin game-panel" aria-label={homeCopy.coinsLabel}>
            <img src={gameIcons.coinPaw} alt="" aria-hidden="true" />
            <div>
              <span>{homeCopy.coinsLabel}</span>
              <strong>{coins.toLocaleString('ko-KR')}</strong>
            </div>
          </div>

          <nav className="pocket-home-quick-menu" aria-label="빠른 메뉴">
            <button type="button" disabled>
              <img src={gameIcons.rewardChest} alt="" aria-hidden="true" />
              <span>{homeCopy.mail}</span>
            </button>
            <button type="button" disabled>
              <img src={gameIcons.trophy} alt="" aria-hidden="true" />
              <span>{homeCopy.event}</span>
            </button>
            <button type="button" disabled>
              <img src={gameIcons.paw} alt="" aria-hidden="true" />
              <span>{homeCopy.settings}</span>
            </button>
          </nav>
        </header>

        <div className="pocket-home-title">
          <span className="pocket-home-eyebrow">{homeCopy.title}</span>
          <h1 className="pocket-home-logo" id="home-title" aria-label={homeCopy.koreanTitle}>
            <span className="pocket-home-logo__letter pocket-home-logo__letter--yellow">포</span>
            <span className="pocket-home-logo__letter pocket-home-logo__letter--orange">켓</span>
            <span className="pocket-home-logo__letter pocket-home-logo__letter--green">랜</span>
            <span className="pocket-home-logo__letter pocket-home-logo__letter--blue">드</span>
            <img src={gameIcons.paw} alt="" aria-hidden="true" />
          </h1>
          <p className="pocket-home-ribbon">{homeCopy.subtitle}</p>
        </div>

        <div className="pocket-home-stage" aria-label="포켓랜드 친구들">
          <img
            className="pocket-home-stage__island"
            src={gameBackgrounds.fantasyIslandStage}
            alt=""
            aria-hidden="true"
          />
          {homeCharacters.map((character) => (
            <figure
              className={`pocket-home-character ${character.className} character-float`}
              key={character.name}
            >
              <img src={character.image} alt="" aria-hidden="true" />
              <figcaption>{character.name}</figcaption>
            </figure>
          ))}
        </div>

        <div className="pocket-home-actions" aria-label="홈 메뉴">
          <button className="game-button game-button--yellow pocket-home-play" type="button" onClick={onPlay}>
            <img src={gameIcons.territoryFlag} alt="" aria-hidden="true" />
            {homeCopy.play}
          </button>
          <div className="pocket-home-secondary-actions">
            <button className="game-button game-button--green" type="button" onClick={onOpenCollection}>
              <img src={gameIcons.paw} alt="" aria-hidden="true" />
              {homeCopy.collection}
            </button>
            <button className="game-button game-button--blue" type="button" disabled>
              <img src={gameIcons.rewardChest} alt="" aria-hidden="true" />
              <span>
                {homeCopy.mission}
                <small>{homeCopy.missionSoon}</small>
              </span>
            </button>
          </div>
        </div>

        <div className="pocket-home-card-grid" aria-label="플레이 정보">
          <article className="game-panel pocket-home-info-card pocket-home-score-card">
            <img src={gameIcons.trophy} alt="" aria-hidden="true" />
            <div>
              <span>{homeCopy.bestScoreLabel}</span>
              <strong>{bestScore}</strong>
              <div className="pocket-home-score-bar" aria-hidden="true">
                <span style={{ width: bestScore === homeCopy.bestScoreEmpty ? '8%' : bestScore }} />
              </div>
            </div>
          </article>
          <article className="game-panel pocket-home-reward-card">
            <header>
              <div>
                <span>{homeCopy.todayRewardLabel}</span>
                <strong>{homeCopy.todayRewardValue}</strong>
              </div>
              <img src={gameIcons.rewardChest} alt="" aria-hidden="true" />
            </header>
            <ol aria-label="출석 보상">
              {dailyRewards.map((reward) => (
                <li className={reward.checked ? 'is-checked' : undefined} key={reward.label}>
                  <span>{reward.label}</span>
                  <img src={reward.icon} alt="" aria-hidden="true" />
                  <strong>{reward.amount}</strong>
                </li>
              ))}
            </ol>
          </article>
          <article className="game-panel pocket-home-info-card pocket-home-info-card--wide">
            <img src={gameIcons.territoryFlag} alt="" aria-hidden="true" />
            <div>
              <span>{homeCopy.territoryTipLabel}</span>
              <strong>{homeCopy.territoryTipValue}</strong>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
