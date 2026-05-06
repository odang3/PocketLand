type GameHudProps = {
  ownedRatio: number;
  targetRatio: number;
  lives: number;
  coinPreview: number;
};

export function GameHud({ ownedRatio, targetRatio, lives, coinPreview }: GameHudProps) {
  return (
    <div className="game-hud game-hud--premium" aria-label="게임 상태">
      <article className="game-hud-pill game-hud-pill--progress">
        <span className="hud-icon" aria-hidden="true">
          🏝️
        </span>
        <div>
          <span>점령률</span>
          <strong>{ownedRatio}%</strong>
          <small>목표 {targetRatio}%</small>
        </div>
      </article>

      <article className="game-hud-pill">
        <span className="hud-icon" aria-hidden="true">
          🪙
        </span>
        <div>
          <span>코인</span>
          <strong>{coinPreview}</strong>
        </div>
      </article>

      <article className="game-hud-pill">
        <span className="hud-icon" aria-hidden="true">
          💗
        </span>
        <div>
          <span>생명</span>
          <strong>{lives}</strong>
        </div>
      </article>

      <button className="pause-button" type="button" aria-label="일시정지">
        II
      </button>
    </div>
  );
}
