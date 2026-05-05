# CODEX_PROMPTS.md

This file contains copy-paste prompts for developing the PocketLand MVP with Codex.
Use these prompts step by step. Do not ask Codex to implement everything in one huge prompt first.

---

## 0. Repository Setup Prompt

```text
Read AGENTS.md first and treat it as the product and technical source of truth.

We are building a Korean-first mobile web MVP called PocketLand: a cute character collection + territory capture game.

First, inspect the current repository. Then report:
1. Current project type and structure
2. Whether it is already a React + TypeScript + Vite app
3. Missing setup items
4. Exact next steps to reach the MVP

Do not modify files yet. Only inspect and propose the plan.
```

---

## 1. New Project Bootstrap Prompt

Use this only if the repository is empty or not yet initialized.

```text
Read AGENTS.md first.

Initialize this repository as a React + TypeScript + Vite web app for the PocketLand MVP.

Requirements:
1. Use React + TypeScript + Vite.
2. Create a clean mobile-first folder structure based on AGENTS.md.
3. Add a Korean-first home screen with title, subtitle, play button, character collection button, coin balance area, and best score area.
4. Add minimal global styling with a cute casual mobile-first look.
5. Do not implement game logic yet.
6. Do not add backend, auth, database, payment, Redux, or a game engine.

After implementation:
1. Run npm install if needed.
2. Run npm run build.
3. Report changed files and verification results.
```

---

## 2. App Navigation and Screen Shell Prompt

```text
Read AGENTS.md first.

Implement the MVP screen flow without the full game engine yet.

Screens required:
1. Home screen
2. Character selection / collection screen
3. Game screen placeholder
4. Result modal placeholder if useful

Requirements:
1. No external router is required unless already installed. A simple internal screen state is acceptable.
2. Home screen should navigate to Play and Collection.
3. Play should open character selection first, then start the game with selected character.
4. Collection should show the same character data but allow selection/unlock later.
5. Use Korean UI copy.
6. Keep UI mobile-first and cute.

Do not implement actual territory capture yet.
After implementation, run npm run build and report changed files.
```

---

## 3. Character Data and localStorage Prompt

```text
Read AGENTS.md first.

Implement the MVP character collection and localStorage persistence.

Characters:
1. 땅냥이: owned by default, coin reward +5%, paw-print theme
2. 말랑젤리: unlock cost 300 coins, speed -10%, jelly theme
3. 펭귄콩: unlock cost 500 coins, enemy speed -10%, ice theme

Requirements:
1. Create typed character data.
2. Implement localStorage utility for:
   - coin balance
   - owned character ids
   - selected character id
   - best score by difficulty
   - total play count
3. Character cards must show owned/locked/selected state.
4. Allow selecting owned characters.
5. Allow unlocking locked characters if enough coins.
6. Show Korean messages for insufficient coins.
7. For development only, add a small non-intrusive debug button or temporary way to grant test coins if needed, but keep it easy to remove.

After implementation, run npm run build and report changed files.
```

---

## 4. Canvas Game Board Skeleton Prompt

```text
Read AGENTS.md first.

Implement the Canvas-based game board skeleton.

Requirements:
1. Create GameCanvas component.
2. Render a responsive square canvas suitable for mobile.
3. Use a grid-based map, preferably 32x32 or 40x40 cells.
4. Define typed game state, cell types, player, enemy, direction, difficulty.
5. Render EMPTY, OWNED, PATH, player, and enemies with simple cute visual placeholders.
6. Initialize a small owned territory around the starting position.
7. Show HUD with owned ratio, target ratio, lives, and selected character.
8. Do not implement full capture yet.
9. Do not require keyboard input.

After implementation, run npm run build and report changed files.
```

---

## 5. Auto Movement and Tap Control Prompt

```text
Read AGENTS.md first.

Implement auto-moving player movement and tap/click direction change.

Control requirements:
1. The character moves automatically on a fixed tick.
2. A tap/click on the game area rotates direction 90 degrees clockwise.
3. Normal gameplay must not require WASD or arrow keys.
4. The movement should be deterministic and easy to tune.
5. Prevent the player from leaving the board.
6. If the player leaves owned territory, create PATH cells.
7. If the player returns to owned territory, call a placeholder capture function for now if flood fill is not implemented yet.

UX requirements:
1. Show a Korean hint: 화면을 탭하면 방향이 바뀌어요.
2. Keep the canvas playable on mobile viewport.

After implementation, run npm run build and report changed files.
```

---

## 6. Flood Fill Territory Capture Prompt

```text
Read AGENTS.md first.

Implement flood-fill based territory capture.

Algorithm requirements:
1. When the player returns to OWNED territory after drawing PATH, treat PATH as temporary walls.
2. Flood fill from map edges to find EMPTY cells connected to the outside.
3. Convert all EMPTY cells not reachable from the outside into OWNED.
4. Convert all PATH cells into OWNED.
5. Clear the player's path list.
6. Recalculate owned ratio accurately.
7. Trigger clear state when owned ratio reaches the target ratio.

Quality requirements:
1. Keep capture logic in a separate pure function where practical.
2. Add comments explaining the flood-fill algorithm.
3. Avoid visual glitches during capture.
4. Include basic defensive handling for edge cases.

After implementation, run npm run build and report changed files.
```

---

## 7. Enemy Movement and Collision Prompt

```text
Read AGENTS.md first.

Implement MVP enemy movement and collision.

Requirements:
1. Add 1 enemy for Easy, 2 for Normal, 3 for Hard if difficulty exists.
2. Enemies move automatically in simple straight or diagonal directions.
3. Enemies bounce or change direction when hitting boundaries or owned territory.
4. If an enemy touches PATH, the player loses 1 life.
5. If lives reach 0, set game state to GAME_OVER.
6. If a life is lost but lives remain, reset player to a safe owned start position and clear current PATH.
7. Apply 펭귄콩's enemy speed reduction if selected.
8. Do not add advanced pathfinding.

After implementation, run npm run build and report changed files.
```

---

## 8. Rewards, Clear, Game Over Prompt

```text
Read AGENTS.md first.

Implement rewards, clear result, and game over result.

Requirements:
1. On clear, award coins based on final owned ratio plus clear bonus.
2. On game over, still award partial coins based on final owned ratio.
3. Apply 땅냥이's coin +5% bonus when selected.
4. Persist new coin balance in localStorage.
5. Persist best score by difficulty.
6. Increment total play count.
7. Show result modal in Korean with:
   - 클리어 or 아쉽지만 다시 도전
   - final owned ratio
   - earned coins
   - best score update if applicable
   - 한 판 더 button
   - 홈으로 button

Suggested formula:
- baseCoins = floor(finalOwnedRatio * 1.2)
- clearBonus = 50 if cleared
- characterBonus applied after base + clear bonus

After implementation, run npm run build and report changed files.
```

---

## 9. Difficulty and Game Tuning Prompt

```text
Read AGENTS.md first.

Add difficulty selection and tune the MVP game feel.

Difficulty settings:
1. Easy: target 60%, lives 3, enemy count 1, slower speed
2. Normal: target 70%, lives 3, enemy count 2, normal speed
3. Hard: target 80%, lives 2, enemy count 3, faster speed

Requirements:
1. Add difficulty selection before game start.
2. Make the game playable in 30 to 90 seconds.
3. Tune player speed so tap-only control feels fair.
4. Tune enemy speed so Easy is actually beginner-friendly.
5. Keep all tuning constants in constants.ts or equivalent.

After implementation, run npm run build and report changed files.
```

---

## 10. Cute Visual Polish Prompt

```text
Read AGENTS.md first.

Polish the UI and game visuals without changing the core game rules.

Requirements:
1. Make the app feel cute, soft, and mobile-friendly.
2. Improve character cards.
3. Improve buttons, spacing, rounded corners, and typography.
4. Make each character visibly affect the game board:
   - 땅냥이: paw/cat-like territory style
   - 말랑젤리: jelly-like territory style
   - 펭귄콩: ice-like territory style
5. Add small Korean character flavor text if easy.
6. Keep performance good.
7. Do not add heavy image assets unless necessary. Emoji, simple SVG, or CSS effects are acceptable.

After implementation, run npm run build and report changed files.
```

---

## 11. Mobile QA and Bug Fix Prompt

```text
Read AGENTS.md first.

Perform a focused QA pass for the PocketLand MVP.

Check and fix issues around:
1. Mobile viewport usability
2. Tap/click control reliability
3. Canvas resizing
4. Territory capture edge cases
5. Enemy/path collision bugs
6. Life reset bugs
7. Clear/game over double-trigger bugs
8. Coin persistence bugs
9. Character unlock/select persistence bugs
10. Build errors and TypeScript errors

Do not add new large features during this QA pass.
After fixes, run npm run build and report changed files, bugs found, and bugs fixed.
```

---

## 12. Final MVP Review Prompt

```text
Read AGENTS.md first.

Review the completed PocketLand MVP against AGENTS.md.

Produce a concise report with:
1. Implemented features
2. Missing MVP requirements, if any
3. Known bugs or risks
4. Suggested next 5 improvements after MVP
5. Files most important for future maintenance

Also run npm run build and report the result.
Do not modify code unless a critical build-breaking issue is found.
```

---

## Optional: Subagent Review Prompt

Use this after the MVP is mostly implemented, if your Codex environment supports subagents.

```text
Read AGENTS.md first.

Spawn separate agents to review the current working tree from these perspectives, wait for all results, and summarize them:
1. Game logic correctness: capture, collision, lives, clear/game over
2. React/TypeScript maintainability
3. Mobile UX and Korean UI copy
4. localStorage persistence and edge cases
5. MVP scope control: check whether unnecessary over-engineering was added

Do not modify code during this review. Produce a consolidated report with prioritized fixes.
```
