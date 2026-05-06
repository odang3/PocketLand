import type { BestScoreByDifficulty } from '../storage/storage';

const homeCopy = {
  title: 'PocketLand',
  koreanTitle: '포켓랜드',
  subtitle: '귀여운 친구들과 땅을 넓혀보세요!',
  play: '플레이하기',
  collection: '캐릭터 도감',
  coinsLabel: '보유 코인',
  bestScoreLabel: '최고 점령',
  bestScoreEmpty: '도전 전',
};

type HomePageProps = {
  coins: number;
  bestScoreByDifficulty: BestScoreByDifficulty;
  onPlay: () => void;
  onOpenCollection: () => void;
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

  return (
    <main className="app-shell app-shell--home">
      <section className="home-screen home-lobby" aria-labelledby="home-title">
        <header className="lobby-topbar" aria-label="로비 상태">
          <div className="coin-bar" aria-label={homeCopy.coinsLabel}>
            <span className="coin-bar__icon" aria-hidden="true">
              🪙
            </span>
            <div>
              <span>{homeCopy.coinsLabel}</span>
              <strong>{coins.toLocaleString('ko-KR')}</strong>
            </div>
          </div>
        </header>

        <div className="lobby-hero">
          <div className="sky-decoration" aria-hidden="true">
            <span className="cloud cloud--left" />
            <span className="cloud cloud--right" />
            <span className="balloon balloon--pink" />
            <span className="balloon balloon--mint" />
          </div>

          <div className="logo-lockup">
            <p className="lobby-eyebrow">원터치 땅따먹기</p>
            <h1 id="home-title">{homeCopy.title}</h1>
            <strong>{homeCopy.koreanTitle}</strong>
            <p>{homeCopy.subtitle}</p>
          </div>

          <div className="character-stage" aria-label="포켓랜드 친구들">
            <div className="hero-character hero-character--jelly">
              <span aria-hidden="true">🫧</span>
              <strong>말랑젤리</strong>
            </div>
            <div className="hero-character hero-character--cat">
              <span aria-hidden="true">🐱</span>
              <strong>땅냥이</strong>
            </div>
            <div className="hero-character hero-character--penguin">
              <span aria-hidden="true">🐧</span>
              <strong>펭귄콩</strong>
            </div>
          </div>

          <div className="land-stage" aria-hidden="true">
            <span className="castle">🏰</span>
            <span className="tile tile--one" />
            <span className="tile tile--two" />
            <span className="tile tile--three" />
          </div>
        </div>

        <div className="lobby-cta-panel">
          <button className="play-button" type="button" onClick={onPlay}>
            <span aria-hidden="true">▶</span>
            {homeCopy.play}
          </button>
          <p className="lobby-best-pill">🏆 {homeCopy.bestScoreLabel} {bestScore}</p>
          <button className="lobby-sub-button" type="button" onClick={onOpenCollection}>
            📖 {homeCopy.collection}
          </button>
        </div>
      </section>
    </main>
  );
}
