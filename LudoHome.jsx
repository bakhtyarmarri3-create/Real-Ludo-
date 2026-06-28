import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { generateRoomId } from './LudoNetwork';

const { width } = Dimensions.get('window');

export default function LudoHome({ onStartGame }) {
  const [playerName, setPlayerName] = useState('');
  const [inputRoomId, setInputRoomId] = useState('');

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      alert('براہ کرم پہلے اپنا نام لکھیں!');
      return;
    }
    const newRoomId = generateRoomId(); 
    onStartGame(newRoomId, playerName, 'RED'); 
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !inputRoomId.trim()) {
      alert('نام اور روم کوڈ دونوں لکھنا ضروری ہے!');
      return;
    }
    onStartGame(inputRoomId, playerName, 'GREEN'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>🎲 APNA LUDO 🎲</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>اپنا نام لکھیں:</Text>
        <TextInput
          style={styles.input}
          placeholder="یہاں نام لکھیں..."
          placeholderTextColor="#999"
          value={playerName}
          onChangeText={setPlayerName}
        />
      </View>

      <TouchableOpacity style={styles.createBtn} onPress={handleCreateRoom}>
        <Text style={styles.btnText}>نیا روم بنائیں (Create Room)</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>یا</Text>

      <View style={styles.card}>
        <Text style={styles.label}>دوست کا روم کوڈ ڈالیں:</Text>
        <TextInput
          style={styles.input}
          placeholder="6 ہندسوں کا کوڈ..."
          placeholderTextColor="#999"
          keyboardType="number-pad"
          value={inputRoomId}
          onChangeText={setInputRoomId}
        />
        <TouchableOpacity style={styles.joinBtn} onPress={handleJoinRoom}>
          <Text style={styles.btnText}>روم جوائن کریں (Join Room)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#2A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFCC00',
    marginBottom: 40,
  },
  card: {
    width: width * 0.85,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  label: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFF',
    color: '#333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  createBtn: {
    width: width * 0.85,
    backgroundColor: '#00A859',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  joinBtn: {
    backgroundColor: '#FFCC00',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    color: '#AAA',
    fontSize: 16,
    marginVertical: 10,
  },
});
