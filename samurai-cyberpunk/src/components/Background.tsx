import { COLORS } from '../colors';

const NUM_STARS = 120;
const stars = Array.from({ length: NUM_STARS }, (_, i) => ({
  x: (Math.sin(i * 127.3) * 0.5 + 0.5) * 1920,
  y: (Math.sin(i * 83.7 + 1.2) * 0.5 + 0.5) * 1080,
  r: 0.5 + (Math.sin(i * 43.1) * 0.5 + 0.5) * 1.5,
  flicker: i % 7,
}));

const NUM_RAIN = 60;
const rainDrops = Array.from({ length: NUM_RAIN }, (_, i) => ({
  x: (Math.sin(i * 173.1) * 0.5 + 0.5) * 1920,
  speed: 8 + (Math.sin(i * 53.3) * 0.5 + 0.5) * 14,
  length: 20 + (Math.sin(i * 91.7) * 0.5 + 0.5) * 50,
  offset: (Math.sin(i * 67.9) * 0.5 + 0.5) * 1080,
  opacity: 0.1 + (Math.sin(i * 31.1) * 0.5 + 0.5) * 0.3,
}));

export const Background: React.FC<{ frame: number }> = ({ frame }) => {
  const flicker = Math.sin(frame * 0.3) * 0.5 + 0.5;
  const pulseIntensity = Math.sin(frame * 0.08) * 0.3 + 0.7;

  return (
    <g>
      {/* Deep space gradient */}
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#1a0030" />
          <stop offset="40%" stopColor="#050015" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
        <radialGradient id="battleGlow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#330011" stopOpacity={0.6 * pulseIntensity} />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8800ff" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#4400aa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <filter id="blur-strong">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <filter id="blur-soft">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="glow-cyan">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect width="1920" height="1080" fill="url(#bgGrad)" />
      <rect width="1920" height="1080" fill="url(#battleGlow)" />

      {/* Stars */}
      {stars.map((s, i) => {
        const brightness = s.flicker === (frame % 7)
          ? 0.3 + flicker * 0.7
          : 0.5 + Math.sin(frame * 0.05 + i) * 0.3;
        return (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="white"
            opacity={brightness}
          />
        );
      })}

      {/* Cyberpunk moon */}
      <circle cx={960} cy={180} r={90} fill="url(#moonGlow)" filter="url(#blur-strong)" />
      <circle cx={960} cy={180} r={55} fill="#1a0055" opacity={0.9} />
      <circle cx={960} cy={180} r={55} fill="none" stroke={COLORS.neonMagenta}
        strokeWidth={2} opacity={0.8 * pulseIntensity} />
      <circle cx={960} cy={180} r={60} fill="none" stroke={COLORS.neonCyan}
        strokeWidth={1} opacity={0.4 * pulseIntensity} />
      {/* Moon circuit lines */}
      <line x1={910} y1={180} x2={1010} y2={180} stroke={COLORS.neonCyan}
        strokeWidth={0.8} opacity={0.5} />
      <line x1={960} y1={130} x2={960} y2={230} stroke={COLORS.neonMagenta}
        strokeWidth={0.8} opacity={0.5} />

      {/* Acid rain */}
      {rainDrops.map((r, i) => {
        const y = (r.offset + frame * r.speed) % (1080 + r.length);
        return (
          <line
            key={i}
            x1={r.x}
            y1={y - r.length}
            x2={r.x + r.length * 0.15}
            y2={y}
            stroke={COLORS.neonCyan}
            strokeWidth={0.8}
            opacity={r.opacity}
          />
        );
      })}

      {/* Distant city silhouette */}
      <CityLine />

      {/* Ground fog */}
      <rect x={0} y={850} width={1920} height={230}
        fill="url(#fogGrad)" opacity={0.7} />
      <defs>
        <linearGradient id="fogGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#110022" stopOpacity="1" />
        </linearGradient>
      </defs>
    </g>
  );
};

const CityLine: React.FC = () => {
  const buildings = [
    { x: 0, w: 80, h: 220 }, { x: 70, w: 50, h: 160 },
    { x: 110, w: 100, h: 300 }, { x: 200, w: 60, h: 200 },
    { x: 250, w: 80, h: 260 }, { x: 320, w: 40, h: 140 },
    { x: 350, w: 90, h: 320 }, { x: 430, w: 50, h: 180 },
    { x: 470, w: 70, h: 240 }, { x: 530, w: 120, h: 350 },
    { x: 640, w: 45, h: 170 }, { x: 675, w: 80, h: 280 },
    // right side
    { x: 1100, w: 80, h: 280 }, { x: 1170, w: 60, h: 200 },
    { x: 1220, w: 100, h: 340 }, { x: 1310, w: 50, h: 170 },
    { x: 1350, w: 90, h: 260 }, { x: 1430, w: 70, h: 220 },
    { x: 1490, w: 120, h: 310 }, { x: 1600, w: 55, h: 190 },
    { x: 1645, w: 80, h: 250 }, { x: 1715, w: 100, h: 330 },
    { x: 1805, w: 60, h: 200 }, { x: 1855, w: 65, h: 270 },
  ];
  return (
    <g opacity={0.6}>
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={1080 - b.h} width={b.w} height={b.h}
            fill="#0a000f" stroke="#220033" strokeWidth={1} />
          {/* windows */}
          {Array.from({ length: Math.floor(b.h / 25) }, (_, j) => (
            <rect
              key={j}
              x={b.x + 8 + (j % 3) * 18}
              y={1080 - b.h + 15 + j * 25}
              width={8}
              height={12}
              fill={j % 5 === 0 ? COLORS.neonCyan : j % 3 === 0 ? COLORS.neonMagenta : '#1a0044'}
              opacity={j % 4 === 0 ? 0.9 : 0.3}
            />
          ))}
          {/* antenna */}
          {i % 3 === 0 && (
            <line
              x1={b.x + b.w / 2}
              y1={1080 - b.h}
              x2={b.x + b.w / 2}
              y2={1080 - b.h - 30}
              stroke={COLORS.neonMagenta}
              strokeWidth={1.5}
              opacity={0.7}
            />
          )}
        </g>
      ))}
    </g>
  );
};
