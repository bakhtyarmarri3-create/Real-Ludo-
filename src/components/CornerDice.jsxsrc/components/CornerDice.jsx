import { useState } from 'react';

const DOT_PATTERNS = {
  1: ['g'],
  2: ['a','b'],
  3: ['a','g','b'],
  4: ['a','c','d','b'],
  5: ['a','c','g','d','b'],
  6: ['a','c','e','f','d','b'],
};
const EMOJIS = ['😂','😡','😍','🔥','👋','🎉','💯','👏'];

const CORNER_STYLE = {
  green:  { top:-80, left:-8 },
  yellow: { top:-80, right:-8 },
  red:    { bottom:-80, left:-8 },
  blue:   { bottom:-80, right:-8 },
};

export default function CornerDice({ color, value, active, timeLeft, totalTime, label, onRoll, onEmoji }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pct = Math.max(0, timeLeft / totalTime);
  const barColor = pct > 0.5 ? '#4caf50' : pct > 0.25 ? '#ff9800' : '#f44336';

  return (
    <div style={{
      position:'absolute', width:72, height:72, zIndex:30,
      display:'flex', flexDirection:'column', alignItems:'center', gap:2,
      ...CORNER_STYLE[color]
    }}>
      <div
        style={{
          position:'absolute', width:20, height:44,
          background:'rgba(0,0,0,0.55)', borderRadius:10,
          fontSize:13, display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', color:'rgba(255,255,255,0.85)', zIndex:35, top:4,
          [color==='green'||color==='red' ? 'right' : 'left']: -24,
        }}
        onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
      >⋮</div>

      <div
        onClick={() => active && onRoll(color)}
        style={{
          width:52, height:52,
          background:'linear-gradient(145deg, #ffffff, #e0e0e0)',
          borderRadius:10, border:`3px solid ${active ? '#222' : '#888'}`,
          display:'grid',
          gridTemplateAreas:'"a . c" "e g f" "d . b"',
          padding:6, gap:2,
          cursor: active ? 'pointer' : 'default',
          opacity: active ? 1 : 0.45,
          filter: active ? 'none' : 'grayscale(0.5)',
          boxShadow: active
            ? '3px 3px 8px rgba(0,0,0,0.4), 0 0 12px 4px rgba(255,220,0,0.55)'
            : '3px 3px 8px rgba(0,0,0,0.4)',
        }}
      >
        {['a','b','c','d','e','f','g'].map((d) => (
          <div key={d} style={{
            gridArea:d, width:8, height:8, borderRadius:'50%', background:'#111',
            alignSelf:'center', justifySelf:'center',
            display: value > 0 && (DOT_PATTERNS[value]||[]).includes(d) ? 'block' : 'none',
          }} />
        ))}
      </div>

      <div style={{
        width:52, height:5, background:'rgba(255,255,255,0.15)',
        borderRadius:3, overflow:'hidden'
      }}>
        <div style={{
          height:'100%', width:`${pct*100}%`,
          background:barColor, transition:'width 1s linear, background 0.3s'
        }} />
      </div>

      <div style={{
        fontSize:9, color:'rgba(255,255,255,0.7)', marginTop:2,
        maxWidth:70, textAlign:'center', overflow:'hidden',
        whiteSpace:'nowrap', textOverflow:'ellipsis'
      }}>
        {label}
      </div>

      {menuOpen && (
        <div style={{
          position:'absolute', background:'rgba(15,8,35,0.97)',
          border:'1.5px solid rgba(255,255,255,0.2)',
          borderRadius:14, padding:10,
          display:'grid', gridTemplateColumns:'repeat(4, 1fr)',
          gap:6, zIndex:200, width:180,
          ...(color==='green'  ? { top:60, left:0   } : {}),
          ...(color==='yellow' ? { top:60, right:0  } : {}),
          ...(color==='red'    ? { bottom:60, left:0  } : {}),
          ...(color==='blue'   ? { bottom:60, right:0 } : {}),
        }}>
          {EMOJIS.map((emoji) => (
            <div key={emoji}
              onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEmoji(emoji); }}
              style={{
                width:36, height:36,
                background:'rgba(255,255,255,0.07)',
                border:'1px solid rgba(255,255,255,0.15)',
                borderRadius:8, display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:22, cursor:'pointer',
              }}
            >{emoji}</div>
          ))}
        </div>
      )}
    </div>
  );
              }
