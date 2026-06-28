import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import LudoBoard from './LudoBoard';
import DiceRoller from './DiceRoller';
import LudoTokens from './LudoTokens';
import LudoDashboard from './LudoDashboard'; // ڈیش بورڈ کو شامل کیا
import { getNextPosition } from './LudoEngine';

export default function App() {
  const [currentTurn, setCurrentTurn] = useState('RED');
  const [diceNumber, setDiceNumber] = useState(1);
  const [hasRolled, setHasRolled] = useState(false);

  const [tokensState, setTokensState] = useState({
    RED:    [-1, -1, -1, -1],
    GREEN:  [-1, -1, -1, -1],
    YELLOW: [-1, -1, -1, -1],
    BLUE:   [-1, -1, -1, -1],
  });

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

  return (
    <SafeAreaView style={styles.container}>
      {/* اوپر اور نیچے کا پریمیم انٹرفیس */}
      <LudoDashboard currentTurn={currentTurn} />

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
    backgroundColor: '#2A1A4E', // تصویر جیسا پریمیم گہرا جامنی/ڈارک بیک گراؤنڈ
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});
