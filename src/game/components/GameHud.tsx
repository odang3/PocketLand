type GameHudProps = {
  ownedRatio: number;
  targetRatio: number;
  lives: number;
  coinPreview: number;
};

export function GameHud({ ownedRatio, targetRatio, lives, coinPreview }: GameHudProps) {
  const progress = Math.min(100, Math.round((ownedRatio / targetRatio) * 100));
  const lifeSlots = Array.from({ length: 3 }, (_, index) => index < lives);

  return (
    <div className="game-hud game-hud--launch" aria-label="게임 상태">
      <article className="game-hud-pill game-hud-pill--progress">
        <div>
          <span>점령 {ownedRatio}%</span>
          <strong>목표 {targetRatio}%</strong>
        </div>
        <div className="hud-progress-bar" aria-hidden="true">
          <span
            className={progress >= 80 ? 'is-near-clear' : undefined}
            style={{ width: `${progress}%` }}
          />
        </div>
      </article>

      <article className="game-hud-pill">
        <span className="hud-icon" aria-hidden="true">
          🪙
        </span>
        <div>
          <span>코인</span>
          <strong>예상 +{coinPreview}</strong>
        </div>
      </article>

      <article className={`game-hud-pill game-hud-pill--lives${lives <= 1 ? ' is-danger' : ''}`}>
        <div>
          <span>생명</span>
          <strong aria-label={`남은 생명 ${lives}개`}>
            {lifeSlots.map((isAlive, index) => (
              <span className={isAlive ? 'life-dot is-alive' : 'life-dot'} key={index} aria-hidden="true">
                ♥
              </span>
            ))}
          </strong>
        </div>
      </article>

      <button className="pause-button" type="button" aria-label="일시정지">
        Ⅱ
      </button>
    </div>
  );
}
