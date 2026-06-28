import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.95; // موبائل اسکرین کے مطابق ایڈجسٹ ایبل سائز
const CELL_SIZE = BOARD_SIZE / 15; // لڈو بورڈ 15x15 گرڈ کا ہوتا ہے

export default function LudoBoard() {
  // اسٹار (Safe Zones) والے خانوں کی پوزیشنز
  const isStarCell = (r, c) => {
    const stars = [
      { r: 6, c: 2 }, { r: 8, c: 12 }, // ہورائزنٹل اسٹارز
      { r: 2, c: 8 }, { r: 12, c: 6 }  // ورٹیکل اسٹارز
    ];
    return stars.some(s => s.r === r && s.c === c);
  };

  // گلوب/شروعاتی خانوں کی پوزیشنز (جیسا تصویر میں ہے)
  const isGlobeCell = (r, c) => {
    const globes = [
      { r: 6, c: 1 },  // گرین سٹارٹ
      { r: 1, c: 8 },  // یلو سٹارٹ
      { r: 13, c: 6 }, // ریڈ سٹارٹ
      { r: 8, c: 13 }  // بلیو سٹارٹ
    ];
    return globes.some(g => g.r === r && g.c === c);
  };

  // ہر خانے کا رنگ طے کرنے والا لاجک
  const getCellColor = (r, c) => {
    // گرین ہوم پاتھ
    if (r === 7 && c > 0 && c < 7) return '#00A859';
    // یلو ہوم پاتھ
    if (c === 7 && r > 0 && r < 7) return '#FFCC00';
    // ریڈ ہوم پاتھ
    if (c === 7 && r > 7 && r < 14) return '#ED1C24';
    // بلیو ہوم پاتھ
    if (r === 7 && c > 7 && c < 14) return '#0054A6';

    // مخصوص رنگین شروعاتی خانے
    if (r === 6 && c === 1) return '#00A859';
    if (r === 1 && c === 8) return '#FFCC00';
    if (r === 13 && c === 6) return '#ED1C24';
    if (r === 8 && c === 13) return '#0054A6';

    return '#FFFFFF'; // باقی تمام عام خانے سفید
  };

  const renderTrack = () => {
    let cells = [];
    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        // 1. چار بڑے ہوم ہاؤسز (Home Bases) کو چھوڑ دیں، ان کا ڈیزائن الگ نیچے ہے
        if ((r < 6 && c < 6) || (r < 6 && c > 8) || (r > 8 && c < 6) || (r > 8 && c > 8)) {
          continue; 
        }
        // 2. سینٹر ہوم (Center Triangle) کو بھی چھوڑ دیں، اس کا ڈیزائن بھی الگ ہے
        if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
          continue;
        }

        // 3. ٹریک کے عام خانے رینڈر کریں
        cells.push(
          <View 
            key={`cell-${r}-${c}`} 
            style={[
              styles.cell, 
              { 
                left: c * CELL_SIZE, 
                top: r * CELL_SIZE,
                backgroundColor: getCellColor(r, c)
              }
            ]}
          >
            {isStarCell(r, c) && <View style={[styles.specialIcon, { backgroundColor: '#AFAFAF' }]} />}
            {isGlobeCell(r, c) && <View style={[styles.specialIcon, { backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 50 }]} />}
          </View>
        );
      }
    }
    return cells;
  };

  return (
    <View style={styles.boardContainer}>
      <View style={styles.board}>
        
        {/* === 1. چاروں ہوم ہاؤسز (Home Bases) === */}
        <View style={[styles.homeBase, styles.greenBase]} />
        <View style={[styles.homeBase, styles.yellowBase]} />
        <View style={[styles.homeBase, styles.redBase]} />
        <View style={[styles.homeBase, styles.blueBase]} />

        {/* === 2. مڈل ٹریک (Grid Path) === */}
        {renderTrack()}

        {/* === 3. سینٹر ہوم ٹرائینگل (Center Home) === */}
        <View style={styles.centerHome}>
          <View style={[styles.triangle, styles.triGreen]} />
          <View style={[styles.triangle, styles.triYellow]} />
          <View style={[styles.triangle, styles.triBlue]} />
          <View style={[styles.triangle, styles.triRed]} />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#FAF9F6',
    borderWidth: 5,
    borderColor: '#5C4033', // تصویر جیسا لکڑی کا خوبصورت بارڈر
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  homeBase: {
    width: CELL_SIZE * 6,
    height: CELL_SIZE * 6,
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#333',
  },
  greenBase:  { top: 0, left: 0, backgroundColor: '#00A859' },
  yellowBase: { top: 0, right: 0, backgroundColor: '#FFCC00' },
  redBase:    { bottom: 0, left: 0, backgroundColor: '#ED1C24' },
  blueBase:   { bottom: 0, right: 0, backgroundColor: '#0054A6' },
  
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    position: 'absolute',
    borderWidth: 0.8,
    borderColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialIcon: {
    width: '70%',
    height: '70%',
    borderRadius: 2,
  },
  centerHome: {
    width: CELL_SIZE * 3,
    height: CELL_SIZE * 3,
    position: 'absolute',
    top: CELL_SIZE * 6,
    left: CELL_SIZE * 6,
  },
  triangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },
  triGreen: {
    top: 0, left: 0,
    borderTopWidth: (CELL_SIZE * 1.5),
    borderBottomWidth: (CELL_SIZE * 1.5),
    borderLeftWidth: (CELL_SIZE * 1.5),
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#00A859',
  },
  triYellow: {
    top: 0, left: 0,
    borderLeftWidth: (CELL_SIZE * 1.5),
    borderRightWidth: (CELL_SIZE * 1.5),
    borderTopWidth: (CELL_SIZE * 1.5),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFCC00',
  },
  triBlue: {
    top: 0, right: 0,
    borderTopWidth: (CELL_SIZE * 1.5),
    borderBottomWidth: (CELL_SIZE * 1.5),
    borderRightWidth: (CELL_SIZE * 1.5),
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#0054A6',
  },
  triRed: {
    bottom: 0, left: 0,
    borderLeftWidth: (CELL_SIZE * 1.5),
    borderRightWidth: (CELL_SIZE * 1.5),
    borderBottomWidth: (CELL_SIZE * 1.5),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ED1C24',
  },
});
