export const START_OFFSET = { green: 0, yellow: 13, blue: 26, red: 39 };
export const SAFE_ABS = [0, 8, 13, 21, 26, 34, 39, 47];
export const START_ABS = [0, 13, 26, 39];

const CELL = 100 / 15;
export function cellPct(row, col) {
  return { left: (col + 0.5) * CELL, top: (row + 0.5) * CELL };
}

export const mainPath = [
  [6,1],[6,2],[6,3],[6,4],[6,5],[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],[0,7],[0,8],
  [1,8],[2,8],[3,8],[4,8],[5,8],[6,9],[6,10],[6,11],[6,12],[6,13],[6,14],[7,14],
  [8,14],[8,13],[8,12],[8,11],[8,10],[8,9],[9,8],[10,8],[11,8],[12,8],[13,8],
  [14,8],[14,7],[14,6],[13,6],[12,6],[11,6],[10,6],[9,6],[8,5],[8,4],[8,3],[8,2],
  [8,1],[8,0],[7,0],[6,0]
];

export const homeColumns = {
  green:  [[7,1],[7,2],[7,3],[7,4],[7,5],[7,6]],
  yellow: [[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],
  blue:   [[7,13],[7,12],[7,11],[7,10],[7,9],[7,8]],
  red:    [[13,7],[12,7],[11,7],[10,7],[9,7],[8,7]],
};
export const CENTER_CELL = [7, 7];

export const homeSlots = {
  green:  [[13,13],[13,27],[27,13],[27,27]],
  yellow: [[13,73],[13,87],[27,73],[27,87]],
  red:    [[73,13],[73,27],[87,13],[87,27]],
  blue:   [[73,73],[73,87],[87,73],[87,87]],
};

function colorOfStartIdx(i) {
  for (const c of Object.keys(START_OFFSET)) if (START_OFFSET[c] === i) return c;
  return null;
}

export function pieceCoord(color, pos) {
  if (pos === -1) return null;
  if (pos === 57) return cellPct(CENTER_CELL[0], CENTER_CELL[1]);
  if (pos >= 51) {
    const rc = homeColumns[color][pos - 51];
    return cellPct(rc[0], rc[1]);
  }
  const abs = (START_OFFSET[color] + pos) % 52;
  return cellPct(mainPath[abs][0], mainPath[abs][1]);
}

export default function LudoBoard({ positions, movableIds, currentColor, onPieceClick }) {
  return (
    <div style={boardStyle}>
      <div style={{ ...quadStyle, top:0, left:0, background:'#1f9d4e', borderRadius:'8px 0 0 0' }}>
        <div style={innerSquareStyle} />
      </div>
      <div style={{ ...quadStyle, top:0, right:0, background:'#e8b400', borderRadius:'0 8px 0 0' }}>
        <div style={innerSquareStyle} />
      </div>
      <div style={{ ...quadStyle, bottom:0, left:0, background:'#d32f2f', borderRadius:'0 0 0 8px' }}>
        <div style={innerSquareStyle} />
      </div>
      <div style={{ ...quadStyle, bottom:0, right:0, background:'#2266cc', borderRadius:'0 0 8px 0' }}>
        <div style={innerSquareStyle} />
      </div>

      <div style={centerTriStyle}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="0,0 50,50 0,100" fill="#1f9d4e" />
          <polygon points="0,0 50,50 100,0" fill="#e8b400" />
          <polygon points="100,0 50,50 100,100" fill="#2266cc" />
          <polygon points="0,100 50,50 100,100" fill="#d32f2f" />
        </svg>
      </div>

      {mainPath.map((rc, i) => {
        const pos = cellPct(rc[0], rc[1]);
        let bg = '#fff';
        let mark = null;
        if (START_ABS.includes(i)) {
          const c = colorOfStartIdx(i);
          const colorMap = { green:'#1f9d4e', yellow:'#e8b400', red:'#d32f2f', blue:'#2266cc' };
          bg = colorMap[c];
          mark = '🚩';
        } else if (SAFE_ABS.includes(i)) {
          mark = '⭐';
        }
        return (
          <div key={`p${i}`} style={{ ...cellStyle, left:`${pos.left}%`, top:`${pos.top}%`, background:bg }}>
            {mark && <span style={{ fontSize:10 }}>{mark}</span>}
          </div>
        );
      })}

      {Object.keys(homeColumns).map((color) =>
        homeColumns[color].map((rc, i) => {
          const pos = cellPct(rc[0], rc[1]);
          const homeColorMap = { green:'#a7e3bd', yellow:'#f6dd8f', red:'#f0a8a8', blue:'#a9c6f0' };
          return (
            <div key={`${color}-home-${i}`}
              style={{ ...cellStyle, left:`${pos.left}%`, top:`${pos.top}%`, background:homeColorMap[color] }}
            />
          );
        })
      )}

      {Object.keys(positions).map((color) =>
        positions[color].map((pos, idx) => {
          const isMovable = currentColor === color && movableIds.includes(idx);
          const coord = pos === -1
            ? { left: homeSlots[color][idx][1], top: homeSlots[color][idx][0] }
            : pieceCoord(color, pos);
          const pieceColorMap = {
            green: 'radial-gradient(circle at 35% 30%, #3fae5e, #0f5c28)',
            yellow: 'radial-gradient(circle at 35% 30%, #ffd84d, #b07d00)',
            red: 'radial-gradient(circle at 35% 30%, #ff6b5b, #a30000)',
            blue: 'radial-gradient(circle at 35% 30%, #5aa8ff, #0c3e8a)',
          };
          return (
            <div key={`${color}-${idx}`}
              onClick={() => isMovable && onPieceClick(color, idx)}
              style={{
                ...pieceStyle,
                left:`${coord.left}%`,
                top:`${coord.top}%`,
                background: pieceColorMap[color],
                cursor: isMovable ? 'pointer' : 'default',
                boxShadow: isMovable
                  ? '0 0 0 3px #fff, 0 0 14px 5px #fff8c4'
                  : 'inset 0 -3px 5px rgba(0,0,0,0.35), 0 2px 5px rgba(0,0,0,0.5)',
                animation: isMovable ? 'piece-pulse 0.7s infinite' : 'none',
              }}
            >
              {color[0].toUpperCase()}{idx + 1}
            </div>
          );
        })
      )}

      <style>{`
        @keyframes piece-pulse {
          0%, 100% { transform: translate(-50%,-50%) scale(1); }
          50% { transform: translate(-50%,-50%) scale(1.25); }
        }
      `}</style>
    </div>
  );
}

const boardStyle = {
  position:'relative', width:'100%', aspectRatio:'1/1', background:'#fff',
  borderRadius:12, border:'5px solid #4f2f18', overflow:'visible',
  boxShadow:'0 10px 30px rgba(0,0,0,0.5)',
};
const quadStyle = {
  position:'absolute', width:'40%', height:'40%',
  display:'flex', alignItems:'center', justifyContent:'center',
};
const innerSquareStyle = {
  width:'78%', height:'78%', background:'rgba(255,255,255,0.92)', borderRadius:10,
};
const centerTriStyle = {
  position:'absolute', width:'20%', height:'20%', top:'40%', left:'40%', zIndex:3,
};
const cellStyle = {
  position:'absolute', width:'6.5%', height:'6.5%', border:'1px solid #ccc',
  display:'flex', alignItems:'center', justifyContent:'center', fontSize:9,
  zIndex:2, transform:'translate(-50%,-50%)',
};
const pieceStyle = {
  position:'absolute', width:'6%', height:'6%', borderRadius:'50%',
  display:'flex', alignItems:'center', justifyContent:'center',
  fontSize:8, fontWeight:800, color:'#fff', zIndex:10,
  transition:'left .4s ease, top .4s ease', transform:'translate(-50%,-50%)',
};
