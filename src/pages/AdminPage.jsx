import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function AdminPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('users');
  const [toast, setToastMsg] = useState('');

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2000);
  }

  async function loadAll() {
    try {
      const [ov, us, lm] = await Promise.all([
        api.adminOverview(token),
        api.adminUsers(token, 1, search),
        api.adminLiveMatches(token),
      ]);
      setOverview(ov);
      setUsers(us.users);
      setLiveMatches(lm.matches);
    } catch (err) {
      showToast(err.message);
    }
  }

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 5000);
    return () => clearInterval(interval);
  }, [search]);

  async function toggleBan(id) {
    try {
      const res = await api.adminToggleBan(token, id);
      showToast(res.message);
      loadAll();
    } catch (err) {
      showToast(err.message);
    }
  }

  async function adjustCoins(id, amount) {
    try {
      const res = await api.adminAdjustCoins(token, id, amount);
      showToast(res.message);
      loadAll();
    } catch (err) {
      showToast(err.message);
    }
  }

  return (
    <div style={styles.wrap}>
      {toast && <div style={styles.toast}>{toast}</div>}

      <div style={styles.header}>
        <h1 style={styles.title}>🛠️ ایڈمن پینل</h1>
        <div style={{ display:'flex', gap:8 }}>
          <button style={styles.smallBtn} onClick={() => navigate('/dashboard')}>ڈیش بورڈ</button>
          <button style={styles.smallBtn} onClick={logout}>خارج ہوں</button>
        </div>
      </div>

      {overview && (
        <div style={styles.statsGrid}>
          <StatCard label="کل یوزرز" value={overview.totalUsers} icon="👤" />
          <StatCard label="آن لائن" value={overview.onlineUsers} icon="🟢" />
          <StatCard label="کل کوائنز" value={overview.totalCoinsInCirculation.toLocaleString()} icon="🪙" />
          <StatCard label="لائیو میچز" value={overview.liveMatches} icon="🎮" />
        </div>
      )}

      <div style={styles.tabRow}>
        <button
          style={{ ...styles.tabBtn, ...(tab==='users' ? styles.tabBtnActive : {}) }}
          onClick={() => setTab('users')}
        >یوزرز</button>
        <button
          style={{ ...styles.tabBtn, ...(tab==='matches' ? styles.tabBtnActive : {}) }}
          onClick={() => setTab('matches')}
        >لائیو میچز</button>
      </div>

      {tab === 'users' && (
        <>
          <input
            style={styles.search}
            placeholder="یوزرنیم یا ای میل تلاش کریں"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={styles.list}>
            {users.map((u) => (
              <div key={u._id} style={styles.userRow}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700 }}>
                    {u.username}
                    {u.role==='admin' && ' 👑'}
                    {u.isBanned && <span style={{ color:'#ff8484' }}> (بلاک)</span>}
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-dim)' }}>{u.email}</div>
                  <div style={{ fontSize:12, marginTop:4 }}>
                    🪙 {u.coins.toLocaleString()} | 🎮 {u.stats?.gamesPlayed||0} گیمز | 🏆 {u.stats?.gamesWon||0} جیتیں
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <button style={styles.tinyBtn} onClick={() => adjustCoins(u._id, 1000)}>+1000</button>
                  <button style={styles.tinyBtn} onClick={() => adjustCoins(u._id, -1000)}>-1000</button>
                  <button
                    style={{ ...styles.tinyBtn, background: u.isBanned ? '#2f9d4e' : '#d83b3b' }}
                    onClick={() => toggleBan(u._id)}
                  >{u.isBanned ? 'ان بلاک' : 'بلاک'}</button>
                </div>
              </div>
            ))}
            {users.length === 0 && <div style={styles.empty}>کوئی یوزر نہیں ملا</div>}
          </div>
        </>
      )}

      {tab === 'matches' && (
        <div style={styles.list}>
          {liveMatches.map((m) => (
            <div key={m._id} style={styles.matchRow}>
              <div style={{ fontWeight:700 }}>
                {m.mode.toUpperCase()} — 💰 {m.betAmount} کوائنز — {m.status==='active' ? 'جاری' : 'انتظار'}
              </div>
              <div style={{ fontSize:12, color:'var(--text-dim)', marginTop:4 }}>
                کھلاڑی: {m.players.map((p) => p.isAI ? 'Computer' : (p.user?.username||'—')).join(', ')}
              </div>
            </div>
          ))}
          {liveMatches.length === 0 && <div style={styles.empty}>کوئی لائیو میچ نہیں</div>}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div style={styles.statCard}>
      <div style={{ fontSize:22 }}>{icon}</div>
      <div style={{ fontSize:20, fontWeight:800, color:'var(--accent-gold)' }}>{value}</div>
      <div style={{ fontSize:11, color:'var(--text-dim)' }}>{label}</div>
    </div>
  );
}

const styles = {
  wrap: { padding:'16px 16px 32px' },
  toast: {
    position:'fixed', top:14, left:'50%', transform:'translateX(-50%)',
    background:'rgba(0,0,0,0.85)', padding:'10px 18px',
    borderRadius:10, fontSize:13, zIndex:50, whiteSpace:'nowrap',
  },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  title: { fontFamily:'var(--font-display)', fontSize:22, color:'var(--accent-gold)' },
  smallBtn: {
    background:'var(--bg-card)', color:'var(--text-main)',
    fontSize:11, padding:'6px 10px', borderRadius:8,
  },
  statsGrid: { display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:10, marginBottom:18 },
  statCard: {
    background:'var(--bg-card)', border:'1px solid var(--border-glow)',
    borderRadius:14, padding:14, textAlign:'center',
  },
  tabRow: { display:'flex', gap:8, marginBottom:14 },
  tabBtn: {
    flex:1, background:'var(--bg-card)', color:'var(--text-main)',
    padding:'10px', borderRadius:10, fontSize:13, fontWeight:600,
  },
  tabBtnActive: {
    background:'var(--bg-card-light)',
    border:'1.5px solid var(--accent-gold)', color:'var(--accent-gold)',
  },
  search: {
    width:'100%', background:'var(--bg-deep)',
    border:'1px solid rgba(255,255,255,0.1)',
    borderRadius:10, padding:'10px 14px',
    color:'var(--text-main)', marginBottom:12, fontSize:14,
  },
  list: { display:'flex', flexDirection:'column', gap:10 },
  userRow: {
    display:'flex', justifyContent:'space-between', gap:10,
    background:'var(--bg-card)', borderRadius:12, padding:12,
  },
  matchRow: { background:'var(--bg-card)', borderRadius:12, padding:12 },
  tinyBtn: {
    background:'var(--bg-card-light)', color:'var(--text-main)',
    fontSize:10, padding:'5px 8px', borderRadius:6,
  },
  empty: { textAlign:'center', color:'var(--text-dim)', padding:20, fontSize:13 },
};
