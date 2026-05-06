import { useEffect, useState } from 'react';
import { characterData, type CharacterId } from '../characters/characterData';
import {
  calculateGameReward,
  type GameRewardResult,
  type GameSessionResultInput,
} from '../game/engine/rewards';
import { loadPlayerSave, savePlayerSave, type PlayerSaveData } from './storage';

export function usePlayerSave() {
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

  return {
    saveData,
    selectedCharacter,
    selectCharacter,
    unlockCharacter,
    grantDebugCoins,
    finishGameSession,
  };
}
