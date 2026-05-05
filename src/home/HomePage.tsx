const homeCopy = {
  title: '포켓랜드',
  subtitle: '귀여운 친구들과 땅을 넓혀보세요!',
  play: '플레이하기',
  collection: '캐릭터 도감',
  coinsLabel: '보유 코인',
  bestScoreLabel: '최고 기록',
  bestScoreEmpty: '아직 기록이 없어요',
};

export function HomePage() {
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
            <strong>0</strong>
          </article>
          <article className="status-card">
            <span>{homeCopy.bestScoreLabel}</span>
            <strong>{homeCopy.bestScoreEmpty}</strong>
          </article>
        </div>

        <div className="action-stack">
          <button className="primary-button" type="button">
            {homeCopy.play}
          </button>
          <button className="secondary-button" type="button">
            {homeCopy.collection}
          </button>
        </div>
      </section>
    </main>
  );
}
