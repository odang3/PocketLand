type GameResultModalProps = {
  onRestart: () => void;
  onBackHome: () => void;
};

export function GameResultModal({ onRestart, onBackHome }: GameResultModalProps) {
  return (
    <div className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
      <div className="result-modal__panel">
        <p className="eyebrow">미리보기 결과</p>
        <h2 id="result-title">게임 결과는 다음 단계에서 만나요</h2>
        <p>지금은 화면 흐름 확인용 모달이에요. 땅 점령과 보상 계산은 아직 적용하지 않았어요.</p>
        <div className="modal-actions">
          <button className="secondary-button" type="button" onClick={onRestart}>
            다시 선택
          </button>
          <button className="primary-button" type="button" onClick={onBackHome}>
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
