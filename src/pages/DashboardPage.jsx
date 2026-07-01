import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { getSocket } from '../api/socket';

const BET_OPTIONS = [50, 100, 250, 500, 1000, 2000];

export default function DashboardPage() {
  const { user, token, logout, updateCoins } = useAuth();
  const navigate = useNavigate();

  const [bonusRemainingMs, setBonusRemainingMs] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [toast, setToastMsg] = useState('');
  const [mode, setMode] = useState('2p');
  const [betAmount, setBetAmount] = useState(100);
  const [searching, setSearching] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    let interval;
    async function fetchStatus() {
      try {
        const data = await api.bonusStatus(token);
        setBonusRemainingMs(data.remainingMs);
      } catch (err) {}
    }
    fetchStatus();
    interval = setInterval(() => {
      setBonusRemainingMs((ms) => (ms !== null && ms > 0 ? ms - 1000 : ms));
    }, 1000);
    return () => clearInterval(interval);
  }, [token]);

  async function handleClaimBonus() {
    setClaiming(true);
    try {
      const data = await api.claimBonus(token);
      updateCoins(data.coins);
      setBonusRemainingMs(24 * 60 * 60 * 1000);
      showToast(data.message);
    } catch (err) {
      showToast(err.message);
    } finally {
      setClaiming(false);
    }
  }

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2200);
  }

  useEffect(() => {
    const socket = getSocket(token);
    socketRef.current = socket;

    socket.on('match:start', (payload) => {
      sessionStorage.setItem(`match_${payload.matchId}`, JSON.stringify(payload));
      navigate(`/game/${payload.matchId}`);
    });
    socket.on('error:message', (msg) => {
      setSearching(false);
      showToast(msg);
    });
    socket.on('queue:waiting', () => setSearching(true));
    socket.on('queue:left', () => setSearching(false));
    socket.on('wallet:update', (data) => updateCoins(data.coins));

    return () => {
      socket.off('match:start');
      socket.off('error:message');
      socket.off('queue:waiting');
      socket.off('queue:left');
      socket.off('wallet:update');
    };
  }, [token]);

  function startSearch() {
    if (user.coins < betAmount) {
      showToast('آپ کے پاس کافی کوائنز نہیں ہیں');
      return;
    }
    setSearching(true);
    socketRef.current.emit('queue:join', { mode, betAmount });
  }

  function cancelSearch() {
    socketRef.current.emit('queue:leave', { mode, betAmount });
    setSearching(false);
  }

  function startAIPractice() {
    socketRef.current.emit('ai:start');
  }

  return (
    <div style={styles.wrap}>
      {toast && <div style={styles.toast}>{toast}</div>}

      <div style={styles.header}>
        <button style={styles.logoutBtn} onClick={logout}>خارج ہوں</button>
        <div style={styles.username}>👤 {user?.username}</div>
      </div>

      <div style={styles.walletCard}>
        <div style={styles.walletIcon}>👛</div>
        <div>
          <div style={styles.walletLabel}>آپ کا والٹ</div>
          <div style={styles.walletTotal}>{user?.coins?.toLocaleString()} 🪙</div>
        </div>
      </div>

      <div style={styles.bonusCard}>
        <div style={styles.bonusLogo}>🎁</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:14 }}>روزانہ بونس</div>
          <div style={{ fontSize:12, color:'var(--text-dim)' }}>
            {bonusRemainingMs === 0
              ? 'ابھی دستیاب ہے!'
              : `باقی وقت: ${formatTime(bonusRemainingMs)}`}
          </div>
        </div>
        <button
          style={{
            ...styles.bonusBtn,
            opacity: bonusRemainingMs > 0 ? 0.4 : 1,
            cursor: bonusRemainingMs > 0 ? 'default' : 'pointer',
          }}
          disabled={bonusRemainingMs > 0 || claiming}
          onClick={handleClaimBonus}
        >
          {claiming ? '...' : 'وصول کریں'}
        </button>
      </div>

      <div style={styles.sectionTitle}>گیم موڈ منتخب کریں</div>
      <div style={styles.modeRow}>
        <button
          style={{ ...styles.modeBtn, ...(mode==='2p' ? styles.modeBtnActive : {}) }}
          onClick={() => setMode('2p')}
        >👥 2 پلیئر</button>
        <button
          style={{ ...styles.modeBtn, ...(mode==='4p' ? styles.modeBtnActive : {}) }}
          onClick={() => setMode('4p')}
        >👥👥 4 پلیئر</button>
      </div>

      <div style={styles.sectionTitle}>کتنے کوائن داؤ پر لگائیں؟</div>
      <div style={styles.betGrid}>
        {BET_OPTIONS.map((amt) => (
          <button
            key={amt}
            style={{ ...styles.betBtn, ...(betAmount===amt ? styles.betBtnActive : {}) }}
            onClick={() => setBetAmount(amt)}
          >{amt}</button>
        ))}
      </div>

      {!searching ? (
        <button style={styles.playBtn} onClick={startSearch}>
          🎮 کھیلنا شروع کریں ({betAmount} کوائنز)
        </button>
      ) : (
        <div style={styles.searchingBox}>
          <div className="spin" style={styles.spinner} />
          <div>کھلاڑی تلاش کیے جا رہے ہیں...</div>
          <button style={styles.cancelBtn} onClick={cancelSearch}>منسوخ کریں</button>
        </div>
      )}

      <button style={styles.aiBtn} onClick={startAIPractice}>
        🤖 کمپیوٹر کے خلاف پریکٹس (مفت)
      </button>

      {user?.role === 'admin' && (
        <button style={styles.adminBtn} onClick={() => navigate('/admin')}>
          🛠️ ایڈمن پینل
        </button>
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function formatTime(ms) {
  if (ms === null || ms === undefined) return '...';
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

const styles = {
  wrap: { padding:'16px 16px 32px' },
  toast: {
    position:'fixed', top:14, left:'50%', transform:'translateX(-50%)',
    background:'rgba(0,0,0,0.85)', padding:'10px 18px',
    borderRadius:10, fontSize:13, zIndex:50, whiteSpace:'nowrap',
  },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 },
  username: { fontWeight:700, fontSize:14 },
  logoutBtn: { background:'transparent', color:'var(--text-dim)', fontSize:12, padding:6 },
  walletCard: {
    display:'flex', alignItems:'center', gap:14,
    background:'linear-gradient(135deg, var(--bg-card-light), var(--bg-card))',
    border:'1.5px solid var(--border-glow)', borderRadius:'var(--radius-lg)',
    padding:'16px 22px', marginBottom:14,
    boxShadow:'0 8px 24px rgba(0,0,0,0.35)',
  },
  walletIcon: { fontSize:34 },
  walletLabel: { fontSize:11, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:0.5 },
  walletTotal: { fontSize:26, fontWeight:800, color:'var(--accent-gold)' },
  bonusCard: {
    display:'flex', alignItems:'center', gap:12,
    background:'var(--bg-card)', border:'1px solid var(--border-glow)',
    borderRadius:'var(--radius-md)', padding:'12px 16px', marginBottom:18,
  },
  bonusLogo: { fontSize:28 },
  bonusBtn: {
    background:'var(--accent-gold)', color:'#241038',
    fontWeight:700, fontSize:12, padding:'8px 14px',
    borderRadius:'var(--radius-sm)',
  },
  sectionTitle: { fontSize:13, color:'var(--text-dim)', marginBottom:8, marginTop:4 },
  modeRow: { display:'flex', gap:10, marginBottom:18 },
  modeBtn: {
    flex:1, background:'var(--bg-card)',
    border:'1.5px solid rgba(255,255,255,0.08)',
    borderRadius:'var(--radius-md)', padding:'14px 8px',
    color:'var(--text-main)', fontSize:14, fontWeight:600,
  },
  modeBtnActive: {
    border:'1.5px solid var(--accent-gold)',
    background:'var(--bg-card-light)',
    boxShadow:'0 0 16px rgba(255,211,77,0.25)',
  },
  betGrid: { display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8, marginBottom:20 },
  betBtn: {
    background:'var(--bg-card)', border:'1.5px solid rgba(255,255,255,0.08)',
    borderRadius:'var(--radius-sm)', padding:'10px 0',
    color:'var(--text-main)', fontWeight:700,
  },
  betBtnActive: {
    border:'1.5px solid var(--accent-gold)',
    background:'var(--bg-card-light)', color:'var(--accent-gold)',
  },
  playBtn: {
    width:'100%',
    background:'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-deep))',
    color:'#241038', fontWeight:800, fontSize:16, padding:'16px',
    borderRadius:'var(--radius-md)', marginBottom:12,
    boxShadow:'0 8px 20px rgba(255,211,77,0.25)',
  },
  searchingBox: {
    display:'flex', flexDirection:'column', alignItems:'center', gap:10,
    background:'var(--bg-card)', borderRadius:'var(--radius-md)',
    padding:20, marginBottom:12,
  },
  spinner: {
    width:28, height:28, border:'3px solid rgba(255,255,255,0.2)',
    borderTopColor:'var(--accent-gold)', borderRadius:'50%',
  },
  cancelBtn: {
    background:'rgba(255,255,255,0.1)', color:'var(--text-main)',
    padding:'8px 18px', borderRadius:8, fontSize:13,
  },
  aiBtn: {
    width:'100%', background:'var(--bg-card)',
    border:'1.5px solid rgba(255,255,255,0.1)',
    color:'var(--text-main)', fontWeight:700, fontSize:14,
    padding:'14px', borderRadius:'var(--radius-md)', marginBottom:12,
  },
  adminBtn: {
    width:'100%', background:'transparent',
    border:'1px dashed var(--text-dim)',
    color:'var(--text-dim)', fontSize:13, padding:'10px',
    borderRadius:'var(--radius-md)',
  },
};
