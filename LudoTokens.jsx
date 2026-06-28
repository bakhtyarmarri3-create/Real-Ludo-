import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BoardTrack, HomePaths } from './LudoEngine'; // انجن کو شامل کیا

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.95;
const CELL_SIZE = BOARD_SIZE / 15;

// ہر رنگ کا اپنا مخصوص اسٹارٹنگ پوائنٹ انڈیکس (BoardTrack میں)
const START_INDEX = {
  GREEN: 0,
  YELLOW: 13,
  BLUE: 26,
  RED: 39
};

export default function LudoTokens({ tokensState, onTokenClick, currentTurn, diceNumber, hasRolled }) {
  
  // گوٹی کی موجودہ پوزیشن کے حساب سے اس کے گرافکس (Row, Column) نکالنے کا لاجک
  const getTokenCoords = (color, pos, tokenIndex) => {
    // 1. اگر گوٹی گھر کے اندر ہے
    if (pos === -1) {
      const homePositions = {
        RED:    [{ r: 2, c: 2 }, { r: 2, c: 3 }, { r: 3, c: 2 }, { r: 3, c: 3 }],
        GREEN:  [{ r: 2, c: 11 }, { r: 2, c: 12 }, { r: 3, c: 11 }, { r: 3, c: 12 }],
        YELLOW: [{ r: 11, c: 11 }, { r: 11, c: 12 }, { r: 12, c: 11 }, { r: 12, c: 12 }],
        BLUE:   [{ r: 11, c: 2 }, { r: 11, c: 3 }, { r: 12, c: 2 }, { r: 12, c: 3 }],
      };
      return homePositions[color][tokenIndex];
    }

    // 2. اگر گوٹی ہوم پاتھ (جیتنے والے راستے) میں ہے
    if (pos >= 52) {
      const homePathIndex = pos - 52;
      return HomePaths[color][homePathIndex] || HomePaths[color][4];
    }

    // 3. اگر گوٹی عام ٹریک پر گھوم رہی ہے
    const globalIndex = (START_INDEX[color] + pos) % 52;
    return BoardTrack[globalIndex];
  };

  const renderTokensByColor = (color, hexColor) => {
    return tokensState[color].map((pos, index) => {
      const coords = getTokenCoords(color, pos, index);
      const isMyTurn = currentTurn === color && hasRolled;
      
      // چیک کریں کہ کیا یہ گوٹی ہلنے کے قابل ہے (گھر سے نکلنے کے لیے 6 چاہیے)
      const isClickable = isMyTurn && (pos !== -1 || diceNumber === 6);

      return (
        <TouchableOpacity
          key={`token-${color}-${index}`}
          disabled={!isClickable}
          onPress={() => onTokenClick(color, index)}
          style={[
            styles.token,
            {
              backgroundColor: hexColor,
              left: coords.c * CELL_SIZE + (CELL_SIZE * 0.15),
              top: coords.row ? coords.row * CELL_SIZE : coords.r * CELL_SIZE + (CELL_SIZE * 0.15),
              borderColor: isClickable ? '#FFF' : 'rgba(255,255,255,0.6)',
              transform: [{ scale: isClickable ? 1.15 : 1 }] // جو گوٹی چل سکتی ہے وہ تھوڑی بڑی اور نمایاں دیکھے گی
            },
          ]}
        >
          <View style={styles.tokenInner} />
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.absoluteOverlay}>
      {renderTokensByColor('RED', '#ED1C24')}
      {renderTokensByColor('GREEN', '#00A859')}
      {renderTokensByColor('YELLOW', '#FFCC00')}
      {renderTokensByColor('BLUE', '#0054A6')}
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteOverlay: {
    position: 'absolute',
    width: BOARD_SIZE,
    height: BOARD_SIZE,
  },
  token: {
    width: CELL_SIZE * 0.7,
    height: CELL_SIZE * 0.7,
    borderRadius: (CELL_SIZE * 0.7) / 2,
    position: 'absolute',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  tokenInner: {
    width: '40%',
    height: '40%',
    borderRadius: 50,
    backgroundColor: '#FFF',
    opacity: 0.9,
  },
});
