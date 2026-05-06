import { DIFFICULTY_ORDER, DIFFICULTY_SETTINGS } from '../constants';
import type { Difficulty } from '../types';

type DifficultySelectPageProps = {
  selectedDifficulty: Difficulty;
  onBack: () => void;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onStartGame: () => void;
};

export function DifficultySelectPage({
  selectedDifficulty,
  onBack,
  onSelectDifficulty,
  onStartGame,
}: DifficultySelectPageProps) {
  return (
    <main className="app-shell">
      <section className="page-screen">
        <header className="page-header">
          <button className="back-button" type="button" onClick={onBack} aria-label="친구 선택으로 돌아가기">
            ←
          </button>
          <div>
            <p className="eyebrow">출발 준비</p>
            <h1>난이도 선택</h1>
          </div>
        </header>

        <p className="page-description">
          한 판은 30초에서 90초 안에 끝나도록 조정했어요. 처음이라면 쉬움부터 시작해 보세요.
        </p>

        <div className="difficulty-list">
          {DIFFICULTY_ORDER.map((difficulty) => {
            const settings = DIFFICULTY_SETTINGS[difficulty];
            const isSelected = difficulty === selectedDifficulty;

            return (
              <button
                className={`difficulty-card${isSelected ? ' is-selected' : ''}`}
                key={difficulty}
                type="button"
                onClick={() => onSelectDifficulty(difficulty)}
              >
                <div>
                  <strong>{settings.label}</strong>
                  <span>{settings.description}</span>
                </div>
                <dl>
                  <div>
                    <dt>목표</dt>
                    <dd>{settings.targetRatio}%</dd>
                  </div>
                  <div>
                    <dt>목숨</dt>
                    <dd>{settings.lives}</dd>
                  </div>
                  <div>
                    <dt>방해꾼</dt>
                    <dd>{settings.enemyCount}</dd>
                  </div>
                </dl>
              </button>
            );
          })}
        </div>

        <button className="primary-button sticky-action" type="button" onClick={onStartGame}>
          이 난이도로 시작
        </button>
      </section>
    </main>
  );
}
