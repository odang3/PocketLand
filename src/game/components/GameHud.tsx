import type { Character } from '../../characters/characterData';

type GameHudProps = {
  ownedRatio: number;
  targetRatio: number;
  lives: number;
  coinPreview: number;
  character: Character;
};

export function GameHud({ ownedRatio, targetRatio, lives, coinPreview, character }: GameHudProps) {
  return (
    <div className="game-hud" aria-label="게임 상태">
      <article>
        <span>점유율</span>
        <strong>{ownedRatio}%</strong>
      </article>
      <article>
        <span>목표</span>
        <strong>{targetRatio}%</strong>
      </article>
      <article>
        <span>목숨</span>
        <strong>{lives}</strong>
      </article>
      <article>
        <span>예상 코인</span>
        <strong>{coinPreview}</strong>
      </article>
      <article className="game-hud__character">
        <span>친구</span>
        <strong>
          {character.emoji} {character.name}
        </strong>
      </article>
    </div>
  );
}
