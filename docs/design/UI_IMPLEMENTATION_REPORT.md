# PocketLand UI 구현 보고서

## 1. 변경 파일 목록

- `src/app/App.tsx`
- `src/home/HomePage.tsx`
- `src/characters/CharacterSelectPage.tsx`
- `src/characters/CharacterCard.tsx`
- `src/storage/usePlayerSave.ts`
- `src/game/components/GameScreen.tsx`
- `src/game/components/GameHud.tsx`
- `src/game/components/GameResultModal.tsx`
- `src/styles/global.css`
- `docs/design/UI_IMPLEMENTATION_REPORT.md`

## 2. 홈 화면 개선 내용

- 비활성 빠른 메뉴, 미션 버튼, 하단 상점/영지 탭을 제거해 MVP 플레이 루프만 남겼다.
- 로고, 한국어 타이틀, 서브타이틀, 3종 캐릭터 히어로가 첫 화면 중심에 보이도록 정리했다.
- 플레이 버튼을 가장 큰 Primary CTA로 유지하고, 도감 버튼은 Secondary CTA로 단순화했다.
- 최고 점령 기록은 플레이 CTA 아래 작은 pill 하나로 축소했다.

## 3. 게임 화면 개선 내용

- 홈 이동 버튼을 `⌂` 아이콘으로 바꿔 목적을 명확히 했다.
- HUD를 점령률 progress bar 중심으로 재배치하고 `예상 +n` 코인 표시를 적용했다.
- 생명을 숫자 대신 하트 3개로 표시하고 생명 1개 남음 상태를 위험색으로 강조했다.
- 실제 기능 없는 큰 스킬 버튼을 제거하고 조작 힌트를 `화면을 탭하면 방향 전환` 한 줄로 줄였다.
- 결과 모달에 메달/효과 아이콘, 정상 한국어 제목, Primary/Secondary CTA 위계를 적용했다.

## 4. 캐릭터 도감 개선 내용

- 개발용 코인 지급 UI를 제거했다.
- 수집 현황을 `수집 n/3`과 progress bar로 정리했다.
- 카드 상태 문구를 `보유`, `잠금`, `선택중`, `해금하기`, `코인 부족`으로 정상화했다.
- 잠금 진행률을 조각 기준이 아니라 실제 코인 비용 기준으로 표시했다.
- 캐릭터 설명을 카드 안에 2줄 제한으로 추가해 수집 카드의 캐릭터성을 강화했다.

## 5. 디자인 지시서 중 반영한 항목

- 한국어 UI 문자열 정상화 및 깨진 이모지 사용 제거 기준을 반영했다.
- 홈 화면의 비활성 미션/출석/상점류 메뉴 제거 지시를 반영했다.
- 홈의 대표 캐릭터 3종, 강한 플레이 CTA, 최고 기록 pill 구성을 반영했다.
- 게임 HUD의 점령 progress, `예상 +n`, 생명 아이콘, 1줄 조작 힌트를 반영했다.
- 도감의 대표 카드, 수집 진행, 2열 카드 상태 구분, 코인 기준 해금 진행을 반영했다.
- 전역 CSS에 주요 색상 토큰을 추가하고 버튼/카드/HUD 보정 스타일을 적용했다.

## 6. 반영하지 못한 항목과 이유

- CSS 파일 전체 재구성은 하지 않았다. 기존 스타일 규모가 크고 UI 수정 범위를 넘어 대규모 리팩토링이 될 수 있어, 토큰 추가와 override 방식으로 범위를 제한했다.
- 수동 모바일 실기 검증과 스크린샷 검증은 수행하지 못했다. 현재 환경에서는 빌드 검증까지 수행했다.

## 7. npm run build 결과

- 성공
- 실행 명령: `npm run build`
- 결과: TypeScript 빌드와 Vite 프로덕션 빌드가 모두 완료됐다.

## 8. 남은 UI 리스크

- `global.css`에 이전 리디자인 스타일과 새 override가 함께 남아 있어 장기적으로는 섹션별 정리가 필요하다.
- 실제 320~360px 기기에서 도감 카드 높이와 HUD 압축 상태는 추가 시각 검수가 필요하다.
- 스킬 버튼 관련 미사용 CSS가 남아 있으므로, 스킬 기능 방향이 확정되면 삭제 또는 재사용 기준을 정리해야 한다.
