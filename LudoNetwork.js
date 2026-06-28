// یہ فائل آن لائن پلیئرز اور رومز کو ہینڈل کرے گی
import { useState, useEffect } from 'react';

// ایک رینڈم 6 ہندسوں کا روم کوڈ بنانے کا فنکشن
export const generateRoomId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export function useLudoNetwork(roomId, playerColor) {
  const [gameState, setGameState] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // نوٹ: جب ہم آگے جا کر Firebase یا Socket کا سرور لنک جوڑیں گے، 
  // تو یہ فنکشنز وہاں ڈیٹا بھیجیں گے۔ ابھی ہم اس کا بیسک لاجک لکھ رہے ہیں۔

  // 1. روم بنانا یا جوائن کرنا
  const joinRoom = (id, color) => {
    console.log(`پلیئر ${color} روم نمبر ${id} میں شامل ہو گیا ہے`);
    setIsConnected(true);
  };

  // 2. جب کوئی کھلاڑی ڈائس رول کرے تو سرور پر اپڈیٹ بھیجنا
  const sendDiceRoll = (score) => {
    if (!isConnected) return;
    console.log(`سرور پر بھیجا گیا: ڈائس اسکور ${score}`);
    // سرور لاجک یہاں آئے گا
  };

  // 3. جب کوئی کھلاڑی گوٹی چلے تو اس کی پوزیشن سب کو بھیجنا
  const sendTokenMove = (updatedTokensState) => {
    if (!isConnected) return;
    console.log("سرور پر گوٹیوں کی نئی پوزیشن اپڈیٹ کر دی گئی ہے");
  };

  return {
    isConnected,
    joinRoom,
    sendDiceRoll,
    sendTokenMove,
  };
}
