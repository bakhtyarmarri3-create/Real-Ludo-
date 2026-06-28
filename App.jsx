import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import LudoBoard from './LudoBoard';
import DiceRoller from './DiceRoller';
import LudoTokens from './LudoTokens';
import LudoDashboard from './LudoDashboard';
import LudoHome from './LudoHome'; // نئی اسکرین کو یہاں جوڑا
import { getNextPosition } from './LudoEngine';

export default function App() {
  const [inGame, setInGame] = useState(false); // چیک کرے گا کہ بندہ ہوم اسکرین پر ہے یا گیم میں
  const [roomCode, setRoomCode] = useState('');
  const [myPlayerName, setMyPlayerName] = useState('');
  const [myColor, setMyColor] = useState('RED');

  const [currentTurn, setCurrentTurn] = useState('RED');
  const [diceNumber, setDiceNumber] = useState(1);
  const [hasRolled, setHasRolled] = useState(false);

  const [tokensState, setTokensState] = useState({
    RED:    [-1, -1, -1, -1],
    GREEN:  [-1, -1, -1, -1],
    YELLOW: [-1, -1, -1, -1],
    BLUE:   [-1, -1, -1, -1],
  });

  const handleStartGame = (id, name, color) => {
    setRoomCode(id);
    setMyPlayerName(name);
    setMyColor(color);
    setInGame(true); // لڈو بورڈ اسکرین کو لوڈ کرو
  };

  const handleDiceRoll = (score) => {
    setDiceNumber(score);
    setHasRolled(true);

    const playerTokens = tokensState[currentTurn];
    const canMoveAny = playerTokens.some(pos => pos !== -1 || score === 6);
    
    if (!canMoveAny) {
      setTimeout(() => moveToNextTurn(), 1200);
    }
  };

  const moveToNextTurn = () => {
    const order = ['RED', 'GREEN', 'YELLOW', 'BLUE'];
    const nextIndex = (order.indexOf(currentTurn) + 1) % order.length;
    setCurrentTurn(order[nextIndex]);
    setHasRolled(false);
  };

  const handleTokenClick = (color, tokenIndex) => {
    if (!hasRolled || currentTurn !== color) return;

    const currentPos = tokensState[color][tokenIndex];
    const newPos = getNextPosition(color, currentPos, diceNumber);

    if (newPos !== currentPos) {
      const updatedTokens = { ...tokensState };
      updatedTokens[color][tokenIndex] = newPos;
      setTokensState(updatedTokens);
    }

    moveToNextTurn();
  };

  // اگر کھلاڑی ابھی ہوم اسکرین پر ہے
  if (!inGame) {
    return <LudoHome onStartGame={handleStartGame} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <LudoDashboard currentTurn={currentTurn} />

      <View style={styles.roomCodeBadge}>
        <Text style={styles.roomCodeText}>روم کوڈ: {roomCode}</Text>
      </View>

      <View style={styles.boardWrapper}>
        <LudoBoard />
        <LudoTokens 
          tokensState={tokensState} 
          onTokenClick={handleTokenClick}
          currentTurn={currentTurn}
          diceNumber={diceNumber}
          hasRolled={hasRolled}
        />
      </View>

      <DiceRoller 
        currentTurn={currentTurn}
        onRollComplete={handleDiceRoll}
        hasRolled={hasRolled}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  roomCodeBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 10,
    zIndex: 20,
  },
  roomCodeText: {
    color: '#FFCC00',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
