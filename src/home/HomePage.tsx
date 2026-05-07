import type { CSSProperties } from 'react';
import { gameBackgrounds, gameCharacters, gameIcons, gameUi } from '../assets/game';
import type { BestScoreByDifficulty } from '../storage/storage';

const homeCopy = {
  title: 'PocketLand',
  koreanTitle: '포켓랜드',
  subtitle: '귀여운 친구들과 반짝이는 섬을 넓혀보세요!',
  play: '플레이하기',
  collection: '캐릭터 도감',
  mission: '미션 보기',
  missionSoon: '준비중',
  coinsLabel: '보유 코인',
  bestScoreLabel: '최고 점령률',
  bestScoreEmpty: '도전 전',
  todayRewardLabel: '오늘의 보상',
  todayRewardValue: '상자 준비 완료',
  territoryTipLabel: '오늘의 목표',
  territoryTipValue: '60% 점령 도전',
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
        </header>

        <div className="pocket-home-title">
          <span className="pocket-home-eyebrow">
            <img src={gameIcons.paw} alt="" aria-hidden="true" />
            터치로 땅 넓히기
          </span>
          <h1 id="home-title">{homeCopy.title}</h1>
          <strong>{homeCopy.koreanTitle}</strong>
          <p>{homeCopy.subtitle}</p>
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
          <article className="game-panel pocket-home-info-card">
            <img src={gameIcons.trophy} alt="" aria-hidden="true" />
            <div>
              <span>{homeCopy.bestScoreLabel}</span>
              <strong>{bestScore}</strong>
            </div>
          </article>
          <article className="game-panel pocket-home-info-card">
            <img src={gameIcons.rewardChest} alt="" aria-hidden="true" />
            <div>
              <span>{homeCopy.todayRewardLabel}</span>
              <strong>{homeCopy.todayRewardValue}</strong>
            </div>
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
