import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

export default function DiceRoller() {
  const [currentTurn, setCurrentTurn] = useState('RED'); // پہلی باری RED کی
  const [diceNumber, setDiceNumber] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // 10 سیکنڈ کا ٹائمر

  const spinValue = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  const playersOrder = ['RED', 'GREEN', 'YELLOW', 'BLUE'];

  // باری تبدیل کرنے کا فنکشن
  const changeTurn = () => {
    const nextIndex = (playersOrder.indexOf(currentTurn) + 1) % playersOrder.length;
    setCurrentTurn(playersOrder[nextIndex]);
    setTimeLeft(10); // نئے کھلاڑی کے لیے ٹائمر دوبارہ 10 پر سیٹ کریں
  };

  // ٹائمر کا لاجک (جیسے ہی باری بدلے، ٹائمر شروع ہو جائے)
  useEffect(() => {
    // پرانے ٹائمر کو کلیئر کریں
    if (timerRef.current) clearInterval(timerRef.current);

    // ہر 1 سیکنڈ بعد ٹائمر کم ہوگا
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // اگر 10 سیکنڈ ختم ہو جائیں تو خود بخود اگلی باری
          clearInterval(timerRef.current);
          changeTurn();
          return 10;
        }
        return prevTime - 1;
      });
    }, 1000);

    // جب کمپوننٹ بند ہو تو ٹائمر صاف ہو جائے
    return () => clearInterval(timerRef.current);
  }, [currentTurn]);

  // چھکا رول کرنے کا لاجک
  const rollDice = () => {
    if (isRolling) return;

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
      
      // ان لائن گیمز میں ڈائس رول کرنے کے بعد بھی ٹائمر رکتا ہے اور گوٹی چلنے کا وقت ملتا ہے،
      // لیکن ابھی ہم اگلی باری پر شفٹ کر رہے ہیں
      changeTurn();
    });
  };

  const spin = spinValue.interpolate({
    inputRange:,
    outputRange: ['0deg', '360deg']
  });

  // موجودہ کھلاڑی کے حساب سے پوزیشن (موبائل اسکرین پر ڈائس کہاں دکھے گا)
  const getDicePosition = () => {
    switch (currentTurn) {
      case 'RED':
        return { bottom: 20, left: 20 }; // نیچھے بائیں طرف (Red کے پاس)
      case 'GREEN':
        return { top: 20, left: 20 };    // اوپر بائیں طرف (Green کے پاس)
      case 'YELLOW':
        return { top: 20, right: 20 };   // اوپر دائیں طرف (Yellow کے پاس)
      case 'BLUE':
        return { bottom: 20, right: 20 };  // نیچے دائیں طرف (Blue کے پاس)
      default:
        return { bottom: 20, left: 20 };
    }
  };

  const getTurnColor = () => {
    if (currentTurn === 'RED') return '#ED1C24';
    if (currentTurn === 'GREEN') return '#00A859';
    if (currentTurn === 'YELLOW') return '#FFCC00';
    return '#0054A6';
  };

  return (
    <View style={styles.fullScreenContainer}>
      
      {/* گیم ایریا جہاں لڈو بورڈ ہوگا (اس کے اوپر اب ایپیسوڈک پوزیشننگ ہوگی) */}
      <View style={styles.gameZone}>
        
        {/* ڈائس کنٹینر جو خود بخود اپنی جگہ بدلے گا */}
        <View style={[styles.diceWrapper, getDicePosition()]}>
          
          {/* چھوٹا ٹائمر انڈیکیٹر */}
          <View style={[styles.timerCircle, { borderColor: getTurnColor() }]}>
            <Text style={styles.timerText}>{timeLeft}s</Text>
          </View>

          {/* گھومنے والا ڈائس */}
          <TouchableOpacity onPress={rollDice} disabled={isRolling} activeOpacity={0.8}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  gameZone: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'transparent', // یہ لڈو بورڈ کے اوپر اوورلے ہوگا
  },
  diceWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  dice: {
    width: 65,
    height: 65,
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  timerCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  timerText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  playerName: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
});
    
