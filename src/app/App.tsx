import { useEffect, useState } from 'react';
import { characterData, type CharacterId } from '../characters/characterData';
import { CharacterSelectPage } from '../characters/CharacterSelectPage';
import { GameScreen } from '../game/components/GameScreen';
import { HomePage } from '../home/HomePage';
import { loadPlayerSave, savePlayerSave, type PlayerSaveData } from '../storage/storage';
import { routes, type AppRoute } from './routes';

export function App() {
  const [screen, setScreen] = useState<AppRoute>(routes.home);
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
    const character = characterData.find((item) => item.id === characterId);
    if (!character || saveData.ownedCharacterIds.includes(characterId)) {
      return;
    }

    if (saveData.coins < character.unlockCost) {
      return;
    }

    setSaveData((currentSave) => ({
      ...currentSave,
      coins: currentSave.coins - character.unlockCost,
      ownedCharacterIds: [...currentSave.ownedCharacterIds, characterId],
      selectedCharacterId: characterId,
    }));
  };

  const grantDebugCoins = () => {
    setSaveData((currentSave) => ({
      ...currentSave,
      coins: currentSave.coins + 100,
    }));
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
        onStartGame={() => setScreen(routes.game)}
        onUnlockCharacter={unlockCharacter}
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
        onBackHome={() => setScreen(routes.home)}
        onRestart={() => setScreen(routes.characterSelect)}
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
