import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function LudoDashboard({ currentTurn }) {
  return (
    <View style={styles.overlayContainer} pointerEvents="box-none">
      
      {/* === 1. ٹاپ بار (Top Header) === */}
      <View style={styles.topBar}>
        <View style={styles.leftRow}>
          <TouchableOpacity style={styles.iconButton}><Text style={styles.btnText}>⚙️</Text></TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}><Text style={styles.btnText}>🏆</Text></TouchableOpacity>
        </View>

        <View style={styles.spectatorBadge}>
          <Text style={styles.specEmoji}>👁️</Text>
          <Text style={styles.specText}>Spectator</Text>
          <Text style={styles.specCount}>0</Text>
        </View>

        <TouchableOpacity style={styles.iconButton}><Text style={styles.btnText}>🛍️</Text></TouchableOpacity>
      </View>

      {/* === 2. پلیئر نیم ٹیگز اور مائیک آئیکونز (تصویر کی طرح) === */}
      {/* ٹاپ رائٹ پلیئر (YELLOW) */}
      <View style={[styles.playerProfileTag, { top: 90, right: 15 }]}>
        <View style={[styles.avatarFrame, { borderColor: '#FFCC00' }]} />
        <Text style={styles.pName}>Player_Yellow</Text>
        <Text style={styles.mikeIcon}>🎙️</Text>
      </View>

      {/* باٹم لیفٹ پلیئر (RED) */}
      <View style={[styles.playerProfileTag, { bottom: 120, left: 15 }]}>
        <View style={[styles.avatarFrame, { borderColor: '#ED1C24' }]} />
        <Text style={styles.pName}>Player_Red</Text>
        <Text style={styles.mikeIcon}>🎙️</Text>
      </View>

      {/* === 3. باٹم ایکشن بار (Bottom Chat & Emojis) === */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.roundActionBtn}><Text style={styles.actionText}>🔇</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.roundActionBtn, styles.yellowBtn]}><Text style={styles.actionText}>😀</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.roundActionBtn, styles.yellowBtn]}><Text style={styles.actionText}>💬</Text></TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
  },
  leftRow: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  btnText: { fontSize: 20 },
  spectatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  specEmoji: { fontSize: 14, color: '#FFF' },
  specText: { color: '#AAA', fontSize: 13, fontWeight: '500' },
  specCount: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  
  playerProfileTag: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
  },
  avatarFrame: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: '#555',
    borderWidth: 3,
    elevation: 4,
  },
  pName: { color: '#FFF', fontSize: 11, fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  mikeIcon: { fontSize: 14, position: 'absolute', right: -5, top: 0, backgroundColor: '#333', borderRadius: 50, padding: 2 },

  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    width: '100%',
    position: 'absolute',
    bottom: 30,
  },
  roundActionBtn: {
    width: 50,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  yellowBtn: {
    backgroundColor: '#FFCC00',
    borderColor: '#E6B800',
  },
  actionText: { fontSize: 20 },
});
