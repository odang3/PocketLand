import { useEffect, useState } from 'react';
import { characterData, type CharacterId } from '../characters/characterData';
import { CharacterSelectPage } from '../characters/CharacterSelectPage';
import { DifficultySelectPage } from '../game/components/DifficultySelectPage';
import { GameScreen } from '../game/components/GameScreen';
import {
  calculateGameReward,
  type GameRewardResult,
  type GameSessionResultInput,
} from '../game/engine/rewards';
import { HomePage } from '../home/HomePage';
import { loadPlayerSave, savePlayerSave, type PlayerSaveData } from '../storage/storage';
import { routes, type AppRoute } from './routes';
import type { Difficulty } from '../game/types';

export function App() {
  const [screen, setScreen] = useState<AppRoute>(routes.home);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [saveData, setSaveData] = useState<PlayerSaveData>(() => loadPlayerSave());
  const selectedCharacter =
    characterData.find((character) => character.id === saveData.selectedCharacterId) ??
    characterData[0];

  useEffect(() => {
    savePlayerSave(saveData);
  }, [saveData]);

  const selectCharacter = (characterId: CharacterId) => {
    if (!saveData.ownedCharacterIds.includes(characterId)) {
      return;
    }

    setSaveData((currentSave) => ({
      ...currentSave,
      selectedCharacterId: characterId,
    }));
  };

  const unlockCharacter = (characterId: CharacterId) => {
    setSaveData((currentSave) => {
      const character = characterData.find((item) => item.id === characterId);
      if (!character || currentSave.ownedCharacterIds.includes(characterId)) {
        return currentSave;
      }

      if (currentSave.coins < character.unlockCost) {
        return currentSave;
      }

      return {
        ...currentSave,
        coins: Math.max(0, currentSave.coins - character.unlockCost),
        ownedCharacterIds: [...currentSave.ownedCharacterIds, characterId],
        selectedCharacterId: characterId,
      };
    });
  };

  const grantDebugCoins = () => {
    setSaveData((currentSave) => ({
      ...currentSave,
      coins: currentSave.coins + 100,
    }));
  };

  const finishGameSession = (resultInput: GameSessionResultInput): GameRewardResult => {
    const rewardResult = calculateGameReward({
      ...resultInput,
      previousBestScore: saveData.bestScoreByDifficulty[resultInput.difficulty],
    });

    setSaveData((currentSave) => ({
      ...currentSave,
      coins: currentSave.coins + rewardResult.earnedCoins,
      bestScoreByDifficulty: {
        ...currentSave.bestScoreByDifficulty,
        [resultInput.difficulty]: Math.max(
          currentSave.bestScoreByDifficulty[resultInput.difficulty],
          rewardResult.finalOwnedRatio,
        ),
      },
      totalPlayCount: currentSave.totalPlayCount + 1,
    }));

    return rewardResult;
  };

  if (screen === routes.characterSelect) {
    return (
      <CharacterSelectPage
        mode="play"
        coins={saveData.coins}
        ownedCharacterIds={saveData.ownedCharacterIds}
        selectedCharacterId={saveData.selectedCharacterId}
        onBack={() => setScreen(routes.home)}
        onGrantDebugCoins={grantDebugCoins}
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
        onGrantDebugCoins={grantDebugCoins}
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
      totalPlayCount={saveData.totalPlayCount}
      onPlay={() => setScreen(routes.characterSelect)}
      onOpenCollection={() => setScreen(routes.collection)}
    />
  );
}
