# AGENTS.md

## Project Overview
This project is a Korean-first casual territory-capture web game.
The game is not a keyboard-control action game. It is a mobile-first, tap/click based, cute character collection game.

Working title: PocketLand / 포켓랜드
Genre: Casual territory capture + character collection
Platform: Web browser first, mobile-first responsive UI
Primary user language: Korean

## Product One-liner
Players control cute auto-moving characters with simple taps/clicks, capture territory, earn coins, unlock collectible characters, and replay short stages to complete their collection.

## Core Product Direction
The project must feel like a light, cute, replayable casual game.
The fun should come from:

1. Simple one-touch play
2. Cute character collection
3. Satisfying territory capture animation
4. Frequent small rewards
5. Short retry loop

Do not make this feel like a difficult WASD arcade game.

## Primary MVP Goals
Build a playable MVP with these features first:

1. Home screen
2. Character selection screen
3. Canvas-based game screen
4. Auto-moving player character
5. Tap/click direction change control
6. Territory path creation
7. Flood-fill based territory capture
8. Enemy movement and collision
9. Coin reward calculation
10. Character unlock system
11. Collection/book screen
12. Local persistence with localStorage
13. Mobile-first responsive layout

## MVP Game Rules

### Basic Flow
1. The player starts inside their owned territory.
2. The player character moves automatically.
3. The user changes direction with tap/click input.
4. When the character leaves owned territory, it creates a temporary path.
5. When the character returns to owned territory, the enclosed territory is captured.
6. Captured territory increases the owned ratio.
7. Coins are awarded based on captured territory and stage result.
8. The player clears the stage when the target owned ratio is reached.
9. The player loses a life when an enemy touches the player path or when the player hits an invalid path.
10. Game over occurs when lives reach 0.

### MVP Clear Condition
- Easy: 60% territory captured
- Normal: 70% territory captured
- Hard: 80% territory captured

### MVP Session Length
- One play session should take approximately 30 to 90 seconds.

## Controls

### Required Control Model
Use tap/click based control only.

Default MVP control:
- Character auto-moves forward.
- A tap/click rotates the character 90 degrees clockwise.
- A visible skill button may be added later, but do not implement complex controls in the first playable milestone.

### Explicitly Forbidden for MVP
Do not require:
- WASD
- Arrow keys
- Complex joystick controls
- Multi-touch gesture dependency
- Keyboard-only gameplay

Keyboard shortcuts may exist for development/debugging only, but they must not be required for normal play.

## Character Collection System

### MVP Characters
Implement exactly these three characters first:

1. 땅냥이
   - Role: default character
   - Unlock: owned by default
   - Ability: coin reward +5%
   - Territory effect: paw-print themed tile style

2. 말랑젤리
   - Role: beginner-friendly character
   - Unlock: 300 coins
   - Ability: movement speed -10%, safer for beginners
   - Territory effect: jelly themed tile style

3. 펭귄콩
   - Role: light strategy character
   - Unlock: 500 coins
   - Ability: enemy speed -10%
   - Territory effect: ice themed tile style

### Character Rules
- Characters should feel collectible and cute.
- The MVP should not include paid gacha.
- Unlocking should use in-game coins only.
- Do not add complex character upgrades in MVP.
- Each character must visibly affect the play screen through color, emoji, icon, or tile style.

## Economy Rules

### Coins
Coins are earned after each play session.

Suggested formula:
- Base coins = floor(finalOwnedRatio * 1.2)
- Clear bonus = 50 coins
- Large capture bonus = optional, only if easy to implement
- Character bonus applies after base calculation

### Failure Reward
Even if the player fails, award some coins based on final owned ratio.
This is important for casual retention.

### Persistence
Use localStorage for MVP:
- owned characters
- selected character
- coin balance
- best score by difficulty
- total play count

Do not add backend authentication, database, server ranking, or payment in MVP.

## Screens

### Home Screen
Must include:
- Game title
- Short Korean subtitle
- Play button
- Character collection button
- Coin balance
- Best score summary

### Character Selection Screen
Must include:
- Character cards
- Lock/unlock state
- Unlock cost
- Selected state
- Ability description in Korean
- Select button for owned characters
- Unlock button for locked characters if enough coins

### Game Screen
Must include:
- Canvas game board
- Owned ratio
- Target ratio
- Lives
- Coin preview or gained coins
- Current character indicator
- Clear/game over modal
- Restart button
- Home button

### Collection Screen
Can be same as character selection screen in MVP.
It should make users feel they are collecting characters.

## Visual Direction
Use a cute, soft, casual style.

Preferred direction:
- Rounded UI
- Soft shadows
- Pastel-friendly palette
- Large buttons
- Korean mobile game style copy
- Emoji or simple SVG icons are acceptable for MVP

Avoid:
- Dark hardcore arcade style
- Complex sci-fi UI
- Text-heavy menus
- Small desktop-only UI

## Technical Stack
Use:
- React
- TypeScript
- Vite
- HTML Canvas for game rendering
- CSS Modules or simple CSS files
- localStorage for MVP persistence

Do not add a backend in MVP.
Do not add a heavy game engine unless explicitly requested.
Do not add Redux unless clearly needed.
Do not over-engineer architecture before the playable MVP works.

## Suggested Project Structure

src/
  app/
    App.tsx
    routes.ts
  game/
    components/
      GameCanvas.tsx
      GameHud.tsx
      GameResultModal.tsx
    engine/
      gameLoop.ts
      grid.ts
      movement.ts
      capture.ts
      collision.ts
      enemy.ts
      rewards.ts
    types.ts
    constants.ts
  characters/
    characterData.ts
    CharacterSelectPage.tsx
    CharacterCard.tsx
  storage/
    storage.ts
  home/
    HomePage.tsx
  styles/
    global.css

This structure is a guideline. Keep it simple if the repository is still small.

## Game Engine Requirements

### Grid
Use a grid-based map for MVP.
Recommended size:
- 32 x 32 or 40 x 40 cells

Cell types:
- EMPTY
- OWNED
- PATH
- WALL if needed

### Territory Capture
Use flood fill for capture detection.
The preferred algorithm:
1. Treat PATH as temporary wall.
2. Flood fill from map edges to find outside-reachable EMPTY cells.
3. Convert unreachable EMPTY cells to OWNED.
4. Convert PATH cells to OWNED.
5. Recalculate owned ratio.

### Movement
The character moves automatically by tick.
Direction changes only when the user taps/clicks.
Keep movement deterministic and easy to test.

### Enemies
MVP enemy behavior:
- Move in a simple straight or diagonal direction.
- Bounce or random-turn when hitting boundaries or owned territory.
- If enemy touches PATH, the player loses a life.

Do not implement advanced pathfinding in MVP.

## Coding Standards

### General
- Use TypeScript types explicitly for game state and domain objects.
- Keep game logic pure where possible.
- Separate rendering from core game logic.
- Prefer small functions over large monolithic components.
- Avoid hidden magic numbers; put core values in constants.ts.
- Keep Korean UI text in a small central object or constants where practical.

### React
- Use functional components.
- Keep React state minimal around game state.
- Avoid unnecessary re-renders during the animation loop.
- Canvas rendering may use refs and requestAnimationFrame.

### CSS/UI
- Mobile-first layout.
- Buttons must be large enough for touch input.
- Avoid tiny click targets.
- Use responsive canvas sizing.

## Testing and Verification

After each implementation milestone, run:
- npm install, if dependencies changed
- npm run build
- npm run lint, if configured
- npm test, if configured

If lint/test scripts do not exist, do not invent unnecessary tooling unless requested.
At minimum, verify that the app builds successfully.

Manual verification checklist:
1. Home screen opens.
2. User can start a game.
3. Character auto-moves.
4. Tap/click changes direction.
5. Leaving owned territory creates path.
6. Returning to owned territory captures territory.
7. Owned ratio increases.
8. Enemy touching path reduces life.
9. Clear condition works.
10. Game over condition works.
11. Coins are awarded.
12. Character unlock persists after refresh.
13. Selected character persists after refresh.
14. Mobile viewport remains usable.

## Development Workflow for Codex

When asked to implement a large feature:
1. Inspect the repository first.
2. Summarize the current structure briefly.
3. Create or update a concise implementation plan.
4. Implement one milestone at a time.
5. Run build/tests after meaningful changes.
6. Report changed files and verification results.

Do not ask the user to decide tiny implementation details that can be reasonably inferred.
Use the MVP direction in this AGENTS.md as the source of truth.

## Non-Goals
Do not implement these in the MVP unless explicitly requested:
- User login
- Server-side database
- Real-time multiplayer
- Online ranking
- Payment
- Paid gacha
- Ads
- Complex skill tree
- Advanced procedural maps
- Full sound/music system
- App store packaging

## Product Tone and Korean Copy
The UI should use friendly Korean copy.
Examples:
- 포켓랜드
- 귀여운 친구들과 땅을 넓혀보세요!
- 플레이하기
- 캐릭터 도감
- 선택하기
- 해금하기
- 코인이 부족해요
- 클리어!
- 아쉽지만 다시 도전!
- 한 판 더!

## Completion Definition for MVP v0.1
The MVP is considered complete when:
1. A user can play a full stage from home screen to result screen.
2. The game can be played without keyboard controls.
3. Territory capture works reliably.
4. At least three collectible characters exist.
5. Coins and unlocks persist in localStorage.
6. The app builds successfully.
7. The UI is usable on a mobile viewport.

## UI Redesign Handoff Rule

When working on PocketLand UI redesign:
1. The designer agent must produce `docs/design/POCKETLAND_UI_REDESIGN_SPEC.md`.
2. The implementer agent must read `docs/design/POCKETLAND_UI_REDESIGN_SPEC.md` before modifying UI code.
3. The implementer must not start implementation if the design spec is missing.
4. After implementation, the implementer must write `docs/design/UI_IMPLEMENTATION_REPORT.md`.
5. UI work is not complete until `npm run build` succeeds.

---

# Pocketland UI Asset Application Task

## Current Task Goal

이번 작업의 목표는 1~3차 포켓랜드 에셋 팩을 사용해서 기존 평면적인 UI를 고급 모바일 캐주얼 게임 UI처럼 개선하는 것이다.

우선 적용 대상은 다음 두 화면이다.

1. 홈 화면
2. 캐릭터 도감 화면

게임 플레이 화면은 이번 작업 범위에서 제외한다.

---

## Scope

### Included

이번 작업 범위는 다음과 같다.

1. 에셋 ZIP 파일 압축 해제 및 폴더 구조 정리
2. 포켓랜드 에셋 export 파일 생성
3. 공통 게임 UI 스타일 생성
4. 홈 화면 UI 고도화
5. 캐릭터 도감 화면 UI 고도화
6. 모바일 QA

### Excluded

이번 작업에서 제외할 항목은 다음과 같다.

1. 게임 플레이 화면 수정
2. 게임 로직 수정
3. 인증 로직 수정
4. 서버/API 수정
5. 라우팅 구조 대규모 변경
6. 상태 관리 구조 대규모 변경
7. DB 또는 저장소 구조 변경

---

## Asset Packs

프로젝트 루트에 아래 ZIP 파일 3개가 존재한다고 가정한다.

```txt
pocketland_asset_pack_phase1.zip
pocketland_background_asset_pack_phase2.zip
pocketland_asset_pack_phase3.zip
```

압축 해제 후 최종 에셋 구조는 아래와 같아야 한다.

```txt
src/assets/game/backgrounds/
  home-sky-bg.webp
  fantasy-island-stage.webp
  cloud-left.webp
  cloud-right.webp
  castle-left.webp
  castle-right.webp
  balloon-pink.webp
  balloon-blue.webp

src/assets/game/characters/
  ddangnyangi.webp
  malang-jelly.webp
  penguin-kong.webp
  purple-enemy.webp
  hamster-captain.webp
  ghost-cat.webp
  baby-dragon.webp

src/assets/game/icons/
  coin-paw.webp
  trophy.webp
  reward-chest.webp
  territory-flag.webp
  paw.webp

src/assets/game/ui/
  sparkle.webp
```

---

## Required Asset Export File

아래 파일을 생성해서 에셋을 한 곳에서 관리한다.

```txt
src/assets/game/index.ts
```

예상 export 객체는 다음과 같다.

```txt
gameCharacters
gameBackgrounds
gameIcons
gameUi
```

화면 컴포넌트에서는 이미지 경로를 직접 길게 import하지 말고, 가능하면 `src/assets/game/index.ts`에서 export한 객체를 사용한다.

---

## Required Common Style File

아래 파일을 생성해서 포켓랜드 전용 공통 게임 UI 스타일을 관리한다.

```txt
src/styles/gameTheme.css
```

필수 스타일 클래스는 다음과 같다.

```txt
pocket-screen
game-panel
game-button
game-button--yellow
game-button--green
game-button--blue
game-deco
character-float
```

---

## Work Order

반드시 아래 순서로 작업한다.

1. 프로젝트 구조 분석
2. 에셋 ZIP 압축 해제 및 폴더 구조 정리
3. `src/assets/game/index.ts` 생성
4. `src/styles/gameTheme.css` 생성
5. 홈 화면만 개선
6. 사용자가 홈 화면을 확인한 뒤 캐릭터 도감 화면 개선
7. 모바일 QA

한 번에 전체 화면을 수정하지 않는다.

---

## Design Direction

전체 디자인 방향은 다음과 같다.

1. 밝은 판타지 하늘 배경
2. 귀엽고 입체감 있는 캐릭터
3. 둥근 모바일 캐주얼 게임 UI
4. 글로시한 pill 형태 버튼
5. 흰색 또는 크림색 카드
6. 두꺼운 외곽선
7. 부드러운 그림자
8. 캐릭터 floating animation
9. 한국어 텍스트 가독성 우선
10. 출시된 모바일 캐주얼 게임 같은 완성도

---

## Important Rules

다음 규칙을 반드시 지킨다.

1. 기존 게임 로직은 건드리지 않는다.
2. 기존 라우팅과 클릭 이벤트는 유지한다.
3. 이미지 전체를 한 장 배경으로 깔지 않는다.
4. 배경, 캐릭터, 아이콘은 이미지 에셋으로 사용한다.
5. 버튼, 카드, 텍스트, 수치는 실제 React 컴포넌트로 유지한다.
6. 모바일 375px~430px 폭을 우선 기준으로 한다.
7. 홈 화면이 통과되기 전에는 캐릭터 도감 화면을 수정하지 않는다.
8. 게임 플레이 화면은 이번 작업에서 수정하지 않는다.
9. 서버/API/DB 관련 코드는 수정하지 않는다.
10. 작업 완료 후 변경 파일과 확인 방법을 반드시 보고한다.

---

## Home Screen Requirements

홈 화면 개선 시 아래 에셋을 사용한다.

```txt
gameBackgrounds.homeSky
gameBackgrounds.fantasyIslandStage
gameBackgrounds.cloudLeft
gameBackgrounds.cloudRight
gameBackgrounds.balloonPink
gameBackgrounds.balloonBlue
gameUi.sparkle

gameCharacters.ddangnyangi
gameCharacters.malangJelly
gameCharacters.penguinKong

gameIcons.coinPaw
gameIcons.trophy
gameIcons.rewardChest
gameIcons.paw
gameIcons.territoryFlag
```

홈 화면 구현 요구사항은 다음과 같다.

1. `home-sky-bg.webp`를 홈 화면 전체 배경으로 적용한다.
2. 구름, 풍선, sparkle을 장식 레이어로 배치한다.
3. `fantasy-island-stage.webp`를 캐릭터 아래 스테이지로 배치한다.
4. 땅냥이, 말랑젤리, 펭귄콩을 중앙에 크게 배치한다.
5. 캐릭터 아래에 이름표를 표시한다.
6. 캐릭터에 drop-shadow와 floating animation을 적용한다.
7. 코인, 트로피, 보상 아이콘을 에셋으로 교체한다.
8. 플레이하기, 캐릭터 도감, 미션 보기 버튼을 입체형 게임 버튼으로 개선한다.
9. 최고 점령률 카드와 오늘의 보상 카드를 `game-panel` 스타일로 개선한다.
10. 기존 클릭 이벤트와 라우팅은 유지한다.

---

## Character Collection Screen Requirements

캐릭터 도감 화면은 홈 화면 확인이 끝난 뒤 작업한다.

사용 캐릭터 에셋은 다음과 같다.

```txt
gameCharacters.ddangnyangi
gameCharacters.malangJelly
gameCharacters.penguinKong
gameCharacters.hamsterCaptain
gameCharacters.ghostCat
gameCharacters.babyDragon
```

사용 아이콘은 다음과 같다.

```txt
gameIcons.coinPaw
gameIcons.paw
gameIcons.rewardChest
```

캐릭터 도감 구현 요구사항은 다음과 같다.

1. 캐릭터 데이터를 배열 기반으로 관리한다.
2. `CharacterCard` 컴포넌트를 생성 또는 개선한다.
3. `FeaturedCharacterPanel` 컴포넌트를 생성 또는 개선한다.
4. 희귀도 배지를 표시한다.
5. 보유/미보유 상태를 표시한다.
6. 조각 진행도 progress를 표시한다.
7. 수집 현황 `2 / 6`을 표시한다.
8. 보상 상자 아이콘을 표시한다.
9. 하단 네비게이션에서 캐릭터 도감 탭 선택 상태를 표시한다.
10. 홈 화면과 동일한 라운드, 그림자, 색감, 버튼 스타일을 유지한다.

---

## Character Data

캐릭터 데이터는 아래 내용을 기준으로 구성한다.

```txt
땅냥이 / 노말 / 공격형 / 랜덤 블록 3개를 제거해요! / 보유
말랑젤리 / 노말 / 지원형 / 주변 블록을 말랑말랑하게 만들어요! / 보유
펭귄콩 / 레어 / 마법형 / 가로 3칸을 얼려 방해를 제거해요! / 20/50
햄찌대장 / 에픽 / 공격형 / 가장 많은 블록을 한 번에 제거해요! / 10/30
유령냥 / 에픽 / 소환형 / 랜덤으로 블록을 소환해요! / 5/30
용용이 / 에픽 / 공격형 / 가로·세로 폭발을 일으켜요! / 0/30
```

---

## Mobile QA Requirements

홈 화면과 캐릭터 도감 화면 작업 후 아래 해상도를 기준으로 QA한다.

```txt
360 x 740
375 x 812
390 x 844
414 x 896
430 x 932
```

확인 항목은 다음과 같다.

1. 캐릭터 이미지가 잘리지 않는지 확인한다.
2. 배경이 찌그러지지 않는지 확인한다.
3. 버튼이 화면 밖으로 밀리지 않는지 확인한다.
4. 텍스트 줄바꿈이 이상하지 않은지 확인한다.
5. 하단 메뉴가 모바일 안전 영역에 걸리지 않는지 확인한다.
6. 기존 페이지 이동이 정상 동작하는지 확인한다.
7. 콘솔 에러가 없는지 확인한다.
8. 이미지 용량 때문에 렌더링이 느려지지 않는지 확인한다.

가능하면 CSS에서 `safe-area-inset-bottom`을 고려한다.

---

## Completion Report Format

각 단계 완료 후 아래 형식으로 보고한다.

1. 작업 요약
2. 변경 파일 목록
3. 추가 파일 목록
4. 사용한 에셋 목록
5. 기존 기능 영향 여부
6. 확인 방법
7. 남은 TODO

## !!
- 모든 답변은 반드시 한국어로 해.
