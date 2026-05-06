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

## !!
- 모든 답변은 반드시 한국어로 해.
