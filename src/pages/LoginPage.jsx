import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = await api.login({ emailOrUsername, password });
      loginWithToken(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.logo}>🎲</div>
      <h1 style={styles.title}>Ludo Star</h1>
      <p style={styles.sub}>اپنے اکاؤنٹ میں داخل ہوں</p>

      <form onSubmit={handleSubmit} style={styles.card}>
        <label style={styles.label}>ای میل یا یوزرنیم</label>
        <input
          style={styles.input}
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          placeholder="آپ کا یوزرنیم یا ای میل"
          required
        />
        <label style={styles.label}>پاس ورڈ</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        {error && <div style={styles.error}>{error}</div>}
        <button style={styles.btn} disabled={busy} type="submit">
          {busy ? 'انتظار کریں...' : 'لاگ ان کریں'}
        </button>
      </form>

      <p style={styles.footer}>
        اکاؤنٹ نہیں ہے؟{' '}
        <Link to="/register" style={styles.link}>نیا اکاؤنٹ بنائیں</Link>
      </p>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight:'100vh', display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center',
    padding:'24px', textAlign:'center',
  },
  logo: { fontSize:56, marginBottom:6 },
  title: {
    fontFamily:'var(--font-display)', fontSize:34,
    color:'var(--accent-gold)', fontWeight:800, marginBottom:4,
  },
  sub: { color:'var(--text-dim)', marginBottom:26, fontSize:14 },
  card: {
    width:'100%', maxWidth:360, background:'var(--bg-card)',
    border:'1px solid var(--border-glow)', borderRadius:'var(--radius-lg)',
    padding:24, display:'flex', flexDirection:'column', gap:8,
    boxShadow:'0 10px 30px rgba(0,0,0,0.4)',
  },
  label: { fontSize:12, color:'var(--text-dim)', marginTop:10, textAlign:'right' },
  input: {
    background:'var(--bg-deep)', border:'1px solid rgba(255,255,255,0.1)',
    borderRadius:'var(--radius-sm)', padding:'12px 14px',
    color:'var(--text-main)', fontSize:15, outline:'none',
  },
  error: { color:'#ff8484', fontSize:13, marginTop:6 },
  btn: {
    marginTop:18,
    background:'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-deep))',
    color:'#241038', fontWeight:800, fontSize:16, padding:'13px',
    borderRadius:'var(--radius-sm)',
  },
  footer: { marginTop:22, fontSize:13, color:'var(--text-dim)' },
  link: { color:'var(--accent-gold)', fontWeight:700 },
};
