import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

export default function DiceRoller({ currentTurn, onRollComplete, hasRolled }) {
  const [diceNumber, setDiceNumber] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // 10 سیکنڈ کا آن لائن ٹائمر

  const spinValue = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  // جیسے ہی کھلاڑی کی باری بدلے، ٹائمر دوبارہ 10 سے شروع ہو جائے
  useEffect(() => {
    setTimeLeft(10);
    
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          // اگر 10 سیکنڈ ختم ہو جائیں اور کھلاڑی رول نہ کرے، تو 0 اسکور کے ساتھ باری تبدیل
          onRollComplete(0); 
          return 10;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentTurn]);

  // اگر کھلاڑی نے رول کر دیا ہے تو ٹائمر کو روک دیں
  useEffect(() => {
    if (hasRolled && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [hasRolled]);

  const rollDice = () => {
    if (isRolling || hasRolled) return; // اگر رول ہو چکا ہے یا گھوم رہا ہے تو دوبارہ کلک نہ ہو

    setIsRolling(true);
    spinValue.setValue(0);

    Animated.timing(spinValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      const newNumber = Math.floor(Math.random() * 6) + 1;
      setDiceNumber(newNumber);
      setIsRolling(false);
      
      // مین فائل (App.jsx) کو رزلٹ بھیجیں
      onRollComplete(newNumber);
    });
  };

  const spin = spinValue.interpolate({
    inputRange:,
    outputRange: ['0deg', '360deg']
  });

  // کھلاڑی کے حساب سے ڈائس کی پوزیشن (اسکرین کے چاروں کونوں پر)
  const getDicePosition = () => {
    switch (currentTurn) {
      case 'RED':    return { bottom: 20, left: 20 };
      case 'GREEN':  return { top: 20, left: 20 };
      case 'YELLOW': return { top: 20, right: 20 };
      case 'BLUE':   return { bottom: 20, right: 20 };
      default:       return { bottom: 20, left: 20 };
    }
  };

  const getTurnColor = () => {
    if (currentTurn === 'RED') return '#ED1C24';
    if (currentTurn === 'GREEN') return '#00A859';
    if (currentTurn === 'YELLOW') return '#FFCC00';
    return '#0054A6';
  };

  return (
    <View style={styles.diceWrapper} pointerEvents="box-none">
      <View style={[styles.diceContainer, getDicePosition()]}>
        
        {/* ٹائمر سرکل */}
        {!hasRolled && (
          <View style={[styles.timerCircle, { borderColor: getTurnColor() }]}>
            <Text style={styles.timerText}>{timeLeft}s</Text>
          </View>
        )}

        {/* اینیمیٹڈ چھکا */}
        <TouchableOpacity onPress={rollDice} disabled={isRolling || hasRolled} activeOpacity={0.8}>
          <Animated.View style={[
            styles.dice, 
            { borderColor: getTurnColor(), transform: [{ rotate: spin }] }
          ]}>
            <Text style={styles.diceText}>{isRolling ? '🌀' : diceNumber}</Text>
          </Animated.View>
        </TouchableOpacity>
        
        <Text style={[styles.playerName, { color: getTurnColor() }]}>{currentTurn}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  diceWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
  },
  diceContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dice: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  diceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  timerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#333',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  timerText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  playerName: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: 'bold',
  }
});
