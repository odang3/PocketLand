import { useState } from 'react';
import { CharacterSelectPage } from '../characters/CharacterSelectPage';
import { DifficultySelectPage } from '../game/components/DifficultySelectPage';
import { GameScreen } from '../game/components/GameScreen';
import { HomePage } from '../home/HomePage';
import { usePlayerSave } from '../storage/usePlayerSave';
import { routes, type AppRoute } from './routes';
import type { Difficulty } from '../game/types';

export function App() {
  const [screen, setScreen] = useState<AppRoute>(routes.home);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const {
    finishGameSession,
    saveData,
    selectCharacter,
    selectedCharacter,
    unlockCharacter,
  } = usePlayerSave();

  if (screen === routes.characterSelect) {
    return (
      <CharacterSelectPage
        mode="play"
        coins={saveData.coins}
        ownedCharacterIds={saveData.ownedCharacterIds}
        selectedCharacterId={saveData.selectedCharacterId}
        onBack={() => setScreen(routes.home)}
        onSelectCharacter={selectCharacter}
        onStartGame={() => setScreen(routes.difficultySelect)}
        onUnlockCharacter={unlockCharacter}
      />
    );
  }

  if (screen === routes.difficultySelect) {
    return (
      <DifficultySelectPage
        selectedDifficulty={selectedDifficulty}
        onBack={() => setScreen(routes.characterSelect)}
        onSelectDifficulty={setSelectedDifficulty}
        onStartGame={() => setScreen(routes.game)}
      />
    );
  }

  if (screen === routes.collection) {
    return (
      <CharacterSelectPage
        mode="collection"
        coins={saveData.coins}
        ownedCharacterIds={saveData.ownedCharacterIds}
        selectedCharacterId={saveData.selectedCharacterId}
        onBack={() => setScreen(routes.home)}
        onSelectCharacter={selectCharacter}
        onUnlockCharacter={unlockCharacter}
      />
    );
  }

  if (screen === routes.game) {
    return (
      <GameScreen
        character={selectedCharacter}
        difficulty={selectedDifficulty}
        onFinishGame={finishGameSession}
        onBackHome={() => setScreen(routes.home)}
      />
    );
  }

  return (
    <HomePage
      coins={saveData.coins}
      bestScoreByDifficulty={saveData.bestScoreByDifficulty}
      onPlay={() => setScreen(routes.characterSelect)}
      onOpenCollection={() => setScreen(routes.collection)}
    />
  );
}
