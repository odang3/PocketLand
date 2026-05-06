import type { BestScoreByDifficulty } from '../storage/storage';

const homeCopy = {
  title: 'PocketLand',
  koreanTitle: '포켓랜드',
  subtitle: '귀여운 친구들과 땅을 넓혀보세요!',
  play: '플레이하기',
  collection: '캐릭터 도감',
  mission: '미션 보기',
  coinsLabel: '보유 코인',
  bestScoreLabel: '최고 점령률',
  bestScoreEmpty: '도전 전',
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

function getAttendanceDay(totalPlayCount: number) {
  return Math.min(7, (totalPlayCount % 7) + 1);
}

export function HomePage({
  coins,
  bestScoreByDifficulty,
  totalPlayCount,
  onPlay,
  onOpenCollection,
}: HomePageProps) {
  const bestScore = formatBestScore(bestScoreByDifficulty);
  const attendanceDay = getAttendanceDay(totalPlayCount);

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

          <nav className="quick-menu" aria-label="빠른 메뉴">
            <button type="button" aria-label="우편함">
              ✉️
            </button>
            <button type="button" aria-label="이벤트">
              🎁
            </button>
            <button type="button" aria-label="설정">
              ⚙️
            </button>
          </nav>
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

        <div className="lobby-info-grid" aria-label="플레이 정보">
          <article className="lobby-info-card lobby-info-card--score">
            <span>🏆 {homeCopy.bestScoreLabel}</span>
            <strong>{bestScore}</strong>
          </article>
          <article className="lobby-info-card">
            <span>🎯 오늘의 보상</span>
            <strong>50 코인</strong>
          </article>
          <article className="lobby-info-card">
            <span>📅 출석 보상</span>
            <strong>{attendanceDay}일차</strong>
          </article>
        </div>

        <div className="lobby-cta-panel">
          <button className="play-button" type="button" onClick={onPlay}>
            <span aria-hidden="true">▶</span>
            {homeCopy.play}
          </button>
          <div className="lobby-secondary-actions">
            <button className="lobby-sub-button" type="button" onClick={onOpenCollection}>
              📖 {homeCopy.collection}
            </button>
            <button className="lobby-sub-button" type="button" disabled>
              ✅ {homeCopy.mission}
            </button>
          </div>
        </div>

        <nav className="lobby-bottom-nav" aria-label="하단 메뉴">
          <button type="button" disabled>
            <span aria-hidden="true">🏪</span>
            상점
          </button>
          <button type="button" disabled>
            <span aria-hidden="true">🏡</span>
            내 영지
          </button>
          <button type="button" onClick={onOpenCollection}>
            <span aria-hidden="true">📚</span>
            도감
          </button>
        </nav>
      </section>
    </main>
  );
}
