import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import LudoBoard from './LudoBoard'; // پہلی فائل کو جوڑا
import DiceRoller from './DiceRoller'; // دوسری فائل کو جوڑا

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* 1. لڈو کا پورا صاف بورڈ */}
      <View style={styles.boardWrapper}>
        <LudoBoard />
      </View>

      {/* 2. ڈائس رولر اور ٹائمر جو بورڈ کے اوپر یا نیچے پوزیشن لے گا */}
      <DiceRoller />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#311042', // تصویر جیسا پریمیم ڈارک بیک گراؤنڈ
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    // یہاں ہم بورڈ کو اسکرین کے سینٹر میں رکھیں گے
  },
});
