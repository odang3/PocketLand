import type { GameRewardResult } from '../engine/rewards';

type GameResultModalProps = {
  rewardResult: GameRewardResult;
  onPlayAgain: () => void;
  onBackHome: () => void;
};

export function GameResultModal({ rewardResult, onPlayAgain, onBackHome }: GameResultModalProps) {
  const isClear = rewardResult.status === 'clear';

  return (
    <div className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
      <div className="result-modal__panel">
        <div className="result-modal__medal" aria-hidden="true">{isClear ? '🏅' : '💫'}</div>
        <p className="eyebrow">게임 결과</p>
        <h2 id="result-title">{isClear ? '클리어!' : '아쉽지만 다시 도전!'}</h2>

        <dl className="result-stats">
          <div>
            <dt>최종 점유율</dt>
            <dd>{rewardResult.finalOwnedRatio}%</dd>
          </div>
          <div>
            <dt>획득 코인</dt>
            <dd>{rewardResult.earnedCoins}코인</dd>
          </div>
          <div>
            <dt>최고 기록</dt>
            <dd>{rewardResult.bestScore}%</dd>
          </div>
        </dl>

        {rewardResult.isBestScoreUpdated ? (
          <p className="result-highlight">새 최고 기록을 세웠어요!</p>
        ) : null}

        <div className="modal-actions">
          <button className="primary-button" type="button" onClick={onPlayAgain}>
            {isClear ? '한 판 더' : '다시 도전'}
          </button>
          <button className="secondary-button" type="button" onClick={onBackHome}>
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
