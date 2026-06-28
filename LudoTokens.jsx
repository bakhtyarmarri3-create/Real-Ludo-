import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.95;
const CELL_SIZE = BOARD_SIZE / 15;

export default function LudoTokens() {
  // چاروں رنگوں کی گوٹیوں کی شروعاتی پوزیشنز (گھر کے اندر کے 4 دائرے)
  const initialTokenPositions = {
    RED:    [{ r: 2, c: 2 }, { r: 2, c: 3 }, { r: 3, c: 2 }, { r: 3, c: 3 }],
    GREEN:  [{ r: 2, c: 11 }, { r: 2, c: 12 }, { r: 3, c: 11 }, { r: 3, c: 12 }],
    YELLOW: [{ r: 11, c: 11 }, { r: 11, c: 12 }, { r: 12, c: 11 }, { r: 12, c: 12 }],
    BLUE:   [{ r: 11, c: 2 }, { r: 11, c: 3 }, { r: 12, c: 2 }, { r: 12, c: 3 }],
  };

  const renderTokens = (color, hexColor) => {
    return initialTokenPositions[color].map((pos, index) => (
      <View
        key={`token-${color}-${index}`}
        style={[
          styles.token,
          {
            backgroundColor: hexColor,
            left: pos.c * CELL_SIZE + (CELL_SIZE * 0.15), // خانے کے بالکل بیچ میں سیٹ کرنے کے لیے
            top: pos.r * CELL_SIZE + (CELL_SIZE * 0.15),
          },
        ]}
      >
        {/* گوٹی کے اندر کا چھوٹا سفید دائرہ (تصویر جیسا پریمیم لک دینے کے لیے) */}
        <View style={styles.tokenInner} />
      </View>
    ));
  };

  return (
    <View style={styles.absoluteOverlay}>
      {renderTokens('RED', '#ED1C24')}
      {renderTokens('GREEN', '#00A859')}
      {renderTokens('YELLOW', '#FFCC00')}
      {renderTokens('BLUE', '#0054A6')}
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteOverlay: {
    position: 'absolute',
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    pointerEvents: 'none', // تاکہ گوٹیوں کے پیچھے موجود ڈائس پر کلک ہو سکے
  },
  token: {
    width: CELL_SIZE * 0.7,
    height: CELL_SIZE * 0.7,
    borderRadius: (CELL_SIZE * 0.7) / 2,
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  tokenInner: {
    width: '40%',
    height: '40%',
    borderRadius: 50,
    backgroundColor: '#FFF',
    opacity: 0.8,
  },
});
