import type { BestScoreByDifficulty } from '../storage/storage';

const homeCopy = {
  title: '포켓랜드',
  subtitle: '귀여운 친구들과 땅을 넓혀보세요!',
  play: '플레이하기',
  collection: '캐릭터 도감',
  coinsLabel: '보유 코인',
  bestScoreLabel: '최고 기록',
  bestScoreEmpty: '아직 기록이 없어요',
};

type HomePageProps = {
  coins: number;
  bestScoreByDifficulty: BestScoreByDifficulty;
  totalPlayCount: number;
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
  totalPlayCount,
  onPlay,
  onOpenCollection,
}: HomePageProps) {
  return (
    <main className="app-shell">
      <section className="home-screen" aria-labelledby="home-title">
        <div className="home-hero">
          <div className="mascot-badge" aria-hidden="true">
            🐾
          </div>
          <p className="eyebrow">캐주얼 땅따먹기</p>
          <h1 id="home-title">{homeCopy.title}</h1>
          <p className="subtitle">{homeCopy.subtitle}</p>
        </div>

        <div className="status-grid" aria-label="플레이 정보">
          <article className="status-card">
            <span>{homeCopy.coinsLabel}</span>
            <strong>{coins.toLocaleString('ko-KR')}</strong>
          </article>
          <article className="status-card">
            <span>{homeCopy.bestScoreLabel}</span>
            <strong>{formatBestScore(bestScoreByDifficulty)}</strong>
          </article>
          <article className="status-card status-card--wide">
            <span>플레이 횟수</span>
            <strong>{totalPlayCount.toLocaleString('ko-KR')}회</strong>
          </article>
        </div>

        <div className="action-stack">
          <button className="primary-button" type="button" onClick={onPlay}>
            {homeCopy.play}
          </button>
          <button className="secondary-button" type="button" onClick={onOpenCollection}>
            {homeCopy.collection}
          </button>
        </div>
      </section>
    </main>
  );
}
