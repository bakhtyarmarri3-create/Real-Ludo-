import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../api/socket';
import LudoBoard from '../components/LudoBoard';
import CornerDice from '../components/CornerDice';

const TOTAL_TIME = 20;
const COLOR_NAME_UR = { green:'سبز', yellow:'پیلا', red:'سرخ', blue:'نیلا' };

export default function GamePage() {
  const { matchId } = useParams();
  const { token, user, updateCoins } = useAuth();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [matchInfo, setMatchInfo] = useState(null);
  const [positions, setPositions] = useState(null);
  const [finished, setFinished] = useState(null);
  const [diceValues, setDiceValues] = useState({});
  const [movableIds, setMovableIds] = useState([]);
  const [currentColor, setCurrentColorState] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [statusText, setStatusText] = useState('کھیل شروع ہو رہا ہے...');
  const [winner, setWinner] = useState(null);
  const [toast, setToastMsg] = useState('');
  const [popups, setPopups] = useState([]);

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 1800);
  }

  const matchInfoColorRef = useRef(null);
  useEffect(() => {
    matchInfoColorRef.current = matchInfo?.yourColor;
  }, [matchInfo]);

  function applyInitialState(payload) {
    setMatchInfo(payload);
    setPositions(payload.state.positions);
    setFinished(payload.state.finished);
    setCurrentColorState(payload.state.colors[payload.state.turnIndex]);
    const dv = {};
    payload.state.colors.forEach((c) => (dv[c] = 0));
    setDiceValues(dv);
    setStatusText(`${COLOR_NAME_UR[payload.state.colors[payload.state.turnIndex]]} کی باری`);
  }

  useEffect(() => {
    const socket = getSocket(token);
    socketRef.current = socket;

    const stored = sessionStorage.getItem(`match_${matchId}`);
    if (stored) applyInitialState(JSON.parse(stored));

    socket.on('match:start', applyInitialState);

    socket.on('game:rolled', ({ color, value, movable }) => {
      setDiceValues((prev) => ({ ...prev, [color]: value }));
      if (color === matchInfoColorRef.current) setMovableIds(movable);
      setStatusText(`${COLOR_NAME_UR[color]} نے ${value} نمبر پایا`);
    });

    socket.on('game:moved', (result) => {
      setPositions((prev) => {
        const updated = { ...prev };
        updated[result.color] = [...updated[result.color]];
        updated[result.color][result.pieceId] = result.newPos;
        return updated;
      });
      setDiceValues((prev) => ({ ...prev, [result.color]: 0 }));
      setMovableIds([]);
      if (result.reachedHome) {
        setFinished((prev) => ({ ...prev, [result.color]: (prev?.[result.color]||0)+1 }));
        showToast(`${COLOR_NAME_UR[result.color]} کی گوٹی گھر پہنچ گئی! 🏠`);
      }
      if (result.captured?.length) {
        result.captured.forEach((c) => showToast(`${COLOR_NAME_UR[c.color]} کی گوٹی کٹ گئی! 💥`));
      }
      setCurrentColorState(result.nextTurnColor);
      setStatusText(`${COLOR_NAME_UR[result.nextTurnColor]} کی باری`);
    });

    socket.on('turn:timer', ({ timeLeft: t, color }) => {
      setTimeLeft(t);
      setCurrentColorState(color);
    });

    socket.on('turn:skipped', ({ nextTurnColor }) => {
      setMovableIds([]);
      setStatusText(`وقت ختم — ${COLOR_NAME_UR[nextTurnColor]} کی باری`);
      setCurrentColorState(nextTurnColor);
    });

    socket.on('game:emoji', ({ color, emoji, username }) => {
      const id = Math.random();
      setPopups((prev) => [...prev, { id, color, emoji }]);
      setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== id)), 1800);
      showToast(`${username} نے ${emoji} بھیجا`);
    });

    socket.on('player:disconnected', ({ color }) => {
      showToast(`${COLOR_NAME_UR[color]} رابطہ منقطع ہو گیا`);
    });

    socket.on('match:finished', ({ winnerColor, potTotal }) => {
      setWinner({ color: winnerColor, pot: potTotal });
    });

    socket.on('wallet:update', (data) => updateCoins(data.coins));
    socket.on('error:message', (msg) => showToast(msg));

    return () => {
      socket.off('match:start');
      socket.off('game:rolled');
      socket.off('game:moved');
      socket.off('turn:timer');
      socket.off('turn:skipped');
      socket.off('game:emoji');
      socket.off('player:disconnected');
      socket.off('match:finished');
      socket.off('wallet:update');
      socket.off('error:message');
    };
  }, [matchId, token]);

  function handleRoll(color) {
    if (color !== currentColor) return showToast('یہ آپ کی باری نہیں');
    if (color !== matchInfo?.yourColor) return showToast('یہ آپ کا ڈائس نہیں ہے');
    socketRef.current.emit('game:roll', { matchId });
  }

  function handlePieceClick(color, pieceId) {
    if (color !== matchInfo?.yourColor) return;
    socketRef.current.emit('game:move', { matchId, pieceId });
  }

  function handleEmoji(emoji) {
    socketRef.current.emit('game:emoji', { matchId, emoji });
  }

  if (!matchInfo || !positions) {
    return <div style={styles.loading}>گیم لوڈ ہو رہا ہے...</div>;
  }

  const colors = matchInfo.state ? matchInfo.state.colors : Object.keys(positions);
  const playerLabel = (color) => {
    const p = matchInfo.players.find((pl) => pl.color === color);
    return p ? p.username : color;
  };

  return (
    <div style={styles.wrap}>
      {toast && <div style={styles.toast}>{toast}</div>}

      {popups.map((p) => (
        <div key={p.id} style={{
          position:'fixed', fontSize:48, zIndex:70,
          pointerEvents:'none',
          ...(p.color==='green'  ? { top:70,    left:70  } : {}),
          ...(p.color==='yellow' ? { top:70,    right:70 } : {}),
          ...(p.color==='red'    ? { bottom:90, left:70  } : {}),
          ...(p.color==='blue'   ? { bottom:90, right:70 } : {}),
        }}>{p.emoji}</div>
      ))}

      {winner && (
        <div style={styles.winnerOverlay}>
          <h1 style={{ fontSize:26 }}>🎉 {COLOR_NAME_UR[winner.color]} جیت گیا!</h1>
          <p style={{ fontSize:14, textAlign:'center', lineHeight:1.6 }}>
            <strong>{playerLabel(winner.color)}</strong> نے جیت لیا
            {winner.pot > 0 && (
              <><br />💰 کل جیتے: <strong>{winner.pot}</strong> کوائنز</>
            )}
          </p>
          <button style={styles.winnerBtn} onClick={() => navigate('/dashboard')}>
            ڈیش بورڈ پر واپس جائیں
          </button>
        </div>
      )}

      <div style={styles.boardOuter}>
        {colors.includes('green') && (
          <CornerDice color="green" value={diceValues.green||0}
            active={currentColor==='green'} timeLeft={timeLeft} totalTime={TOTAL_TIME}
            label={playerLabel('green')} onRoll={handleRoll} onEmoji={handleEmoji} />
        )}
        {colors.includes('yellow') && (
          <CornerDice color="yellow" value={diceValues.yellow||0}
            active={currentColor==='yellow'} timeLeft={timeLeft} totalTime={TOTAL_TIME}
            label={playerLabel('yellow')} onRoll={handleRoll} onEmoji={handleEmoji} />
        )}
        {colors.includes('red') && (
          <CornerDice color="red" value={diceValues.red||0}
            active={currentColor==='red'} timeLeft={timeLeft} totalTime={TOTAL_TIME}
            label={playerLabel('red')} onRoll={handleRoll} onEmoji={handleEmoji} />
        )}
        {colors.includes('blue') && (
          <CornerDice color="blue" value={diceValues.blue||0}
            active={currentColor==='blue'} timeLeft={timeLeft} totalTime={TOTAL_TIME}
            label={playerLabel('blue')} onRoll={handleRoll} onEmoji={handleEmoji} />
        )}

        <LudoBoard
          positions={positions}
          movableIds={matchInfo.yourColor===currentColor ? movableIds : []}
          currentColor={currentColor}
          onPieceClick={handlePieceClick}
        />
      </div>

      <div style={styles.statusText}>{statusText}</div>

      {matchInfo.betAmount > 0 && (
        <div style={styles.betBadge}>
          💰 داؤ: {matchInfo.betAmount} کوائنز فی کھلاڑی
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { padding:'14px 14px 30px' },
  loading: {
    minHeight:'100vh', display:'flex',
    alignItems:'center', justifyContent:'center',
    color:'var(--accent-gold)',
  },
  toast: {
    position:'fixed', top:14, left:'50%', transform:'translateX(-50%)',
    background:'rgba(0,0,0,0.85)', padding:'10px 18px',
    borderRadius:10, fontSize:13, zIndex:60, whiteSpace:'nowrap',
  },
  boardOuter: { position:'relative', margin:'70px 14px 90px' },
  statusText: {
    textAlign:'center', fontSize:13, opacity:0.9,
    padding:'6px 16px', minHeight:18,
  },
  betBadge: {
    textAlign:'center', fontSize:12, color:'var(--accent-gold)',
    background:'var(--bg-card)', borderRadius:10,
    padding:'8px', margin:'0 16px',
  },
  winnerOverlay: {
    position:'fixed', inset:0, background:'rgba(0,0,0,0.85)',
    display:'flex', alignItems:'center', justifyContent:'center',
    flexDirection:'column', gap:16, padding:20, zIndex:100, textAlign:'center',
  },
  winnerBtn: {
    padding:'12px 28px', borderRadius:24,
    background:'var(--accent-gold)', color:'#241038', fontWeight:700, fontSize:15,
  },
};
