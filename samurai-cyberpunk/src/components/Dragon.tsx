import { interpolate } from 'remotion';
import { COLORS } from '../colors';

interface DragonProps {
  frame: number;
  phase: 'approach' | 'battle' | 'fireball' | 'retreat';
}

export const Dragon: React.FC<DragonProps> = ({ frame, phase }) => {
  const bodyWave = Math.sin(frame * 0.12) * 18;
  const wingFlap = Math.sin(frame * 0.22) * 25;

  let x = 1400;
  let y = 260;
  let scale = 1;
  let opacity = 1;

  if (phase === 'approach') {
    x = interpolate(frame, [0, 60], [2200, 1380], { extrapolateRight: 'clamp' });
    y = interpolate(frame, [0, 60], [100, 260], { extrapolateRight: 'clamp' });
    opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  } else if (phase === 'battle') {
    x = 1380 + Math.sin(frame * 0.08) * 40;
    y = 260 + bodyWave;
  } else if (phase === 'fireball') {
    x = 1380 + Math.sin(frame * 0.1) * 30;
    y = 255 + bodyWave;
    scale = 1 + Math.sin(frame * 0.2) * 0.05;
  } else if (phase === 'retreat') {
    x = interpolate(frame, [0, 40], [1380, 2400], { extrapolateRight: 'clamp' });
    y = interpolate(frame, [0, 40], [260, 0], { extrapolateRight: 'clamp' });
    opacity = interpolate(frame, [20, 40], [1, 0], { extrapolateRight: 'clamp' });
  }

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      <defs>
        <radialGradient id="dragonBodyGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#330000" />
          <stop offset="50%" stopColor="#660000" />
          <stop offset="100%" stopColor="#1a0000" />
        </radialGradient>
        <filter id="dragonGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="fireGlow">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="fireGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#ffff00" />
          <stop offset="60%" stopColor={COLORS.dragonFire} />
          <stop offset="100%" stopColor={COLORS.dragonRed} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Dragon aura */}
      <ellipse cx={0} cy={0} rx={280} ry={180}
        fill={COLORS.dragonRed} opacity={0.08}
        filter="url(#dragonGlow)" />

      {/* Tail segments */}
      <TailSegments wave={bodyWave} frame={frame} />

      {/* Wings */}
      <Wing side="upper" flap={wingFlap} frame={frame} />
      <Wing side="lower" flap={wingFlap} frame={frame} />

      {/* Main body */}
      <DragonBody />

      {/* Head */}
      <DragonHead frame={frame} phase={phase} />

      {/* Cyber implants */}
      <CyberImplants frame={frame} />
    </g>
  );
};

const TailSegments: React.FC<{ wave: number; frame: number }> = ({ wave, frame }) => {
  const segments = [
    { cx: 140, cy: wave * 0.3, rx: 55, ry: 35 },
    { cx: 230, cy: wave * 0.6, rx: 45, ry: 28 },
    { cx: 310, cy: wave * 0.85, rx: 36, ry: 22 },
    { cx: 380, cy: wave, rx: 26, ry: 16 },
    { cx: 440, cy: wave * 1.1, rx: 18, ry: 11 },
    { cx: 490, cy: wave * 1.15, rx: 12, ry: 7 },
  ];
  return (
    <g>
      {segments.map((s, i) => (
        <ellipse key={i}
          cx={s.cx} cy={s.cy}
          rx={s.rx} ry={s.ry}
          fill="url(#dragonBodyGrad)"
          stroke={COLORS.dragonRed}
          strokeWidth={1}
        />
      ))}
      {/* Tail spikes */}
      {segments.map((s, i) => (
        <polygon key={i}
          points={`${s.cx},${s.cy - s.ry - 14} ${s.cx - 5},${s.cy - s.ry} ${s.cx + 5},${s.cy - s.ry}`}
          fill={COLORS.dragonFire}
          opacity={0.7}
        />
      ))}
    </g>
  );
};

const Wing: React.FC<{ side: 'upper' | 'lower'; flap: number; frame: number }> = ({ side, flap, frame }) => {
  const mult = side === 'upper' ? -1 : 1;
  const baseY = side === 'upper' ? -60 : 60;
  const flapY = flap * mult;
  const glowOpacity = 0.15 + Math.sin(frame * 0.1) * 0.08;

  return (
    <g>
      {/* Wing membrane glow */}
      <path
        d={`M -20 ${baseY} Q -120 ${baseY + flapY * 2 - 60 * mult} -280 ${baseY + flapY * 3 - 120 * mult}
            Q -180 ${baseY + flapY * 2} -80 ${baseY + flapY}
            Q -40 ${baseY + flapY * 0.5} -20 ${baseY} Z`}
        fill={COLORS.dragonRed}
        opacity={glowOpacity}
        filter="url(#fireGlow)"
      />
      {/* Wing bone structure */}
      <path
        d={`M -20 ${baseY} L -280 ${baseY + flapY * 3 - 120 * mult}`}
        stroke={COLORS.dragonRed}
        strokeWidth={3}
        opacity={0.8}
      />
      <path
        d={`M -20 ${baseY} L -200 ${baseY + flapY * 2 - 80 * mult}`}
        stroke={COLORS.dragonRed}
        strokeWidth={2.5}
        opacity={0.7}
      />
      <path
        d={`M -20 ${baseY} L -130 ${baseY + flapY - 40 * mult}`}
        stroke={COLORS.bloodRed}
        strokeWidth={2}
        opacity={0.6}
      />
      {/* Wing membrane */}
      <path
        d={`M -20 ${baseY}
            Q -100 ${baseY + flapY - 30 * mult} -130 ${baseY + flapY - 40 * mult}
            Q -180 ${baseY + flapY * 1.5 - 60 * mult} -200 ${baseY + flapY * 2 - 80 * mult}
            Q -240 ${baseY + flapY * 2.5 - 100 * mult} -280 ${baseY + flapY * 3 - 120 * mult}
            Q -200 ${baseY + flapY * 2 - 40 * mult} -80 ${baseY + flapY}
            Z`}
        fill={COLORS.dragonRed}
        opacity={0.35}
      />
      {/* Neon vein on wing */}
      <path
        d={`M -20 ${baseY} Q -150 ${baseY + flapY * 2 - 70 * mult} -260 ${baseY + flapY * 3 - 110 * mult}`}
        fill="none"
        stroke={COLORS.neonMagenta}
        strokeWidth={1}
        opacity={0.4}
      />
    </g>
  );
};

const DragonBody: React.FC = () => (
  <g>
    {/* Body segments */}
    <ellipse cx={0} cy={0} rx={105} ry={65} fill="url(#dragonBodyGrad)"
      stroke={COLORS.dragonRed} strokeWidth={1.5} />
    <ellipse cx={-60} cy={5} rx={85} ry={55} fill="url(#dragonBodyGrad)"
      stroke={COLORS.dragonRed} strokeWidth={1} />
    {/* Scales texture */}
    {Array.from({ length: 5 }, (_, row) =>
      Array.from({ length: 8 }, (_, col) => (
        <ellipse key={`${row}-${col}`}
          cx={-80 + col * 22 + (row % 2) * 11}
          cy={-25 + row * 14}
          rx={9} ry={6}
          fill="none"
          stroke={COLORS.bloodRed}
          strokeWidth={0.8}
          opacity={0.5}
        />
      ))
    )}
    {/* Spine ridge */}
    {[-50, -30, -10, 10, 30, 50, 70, 90].map((x, i) => (
      <polygon key={i}
        points={`${x},-65 ${x - 6},-55 ${x + 6},-55`}
        fill={COLORS.dragonFire}
        opacity={0.8}
      />
    ))}
    {/* Chest cyber plate */}
    <ellipse cx={20} cy={10} rx={40} ry={30}
      fill="#1a0000" stroke={COLORS.neonMagenta} strokeWidth={1} opacity={0.9} />
    <line x1={0} y1={-15} x2={0} y2={30}
      stroke={COLORS.neonMagenta} strokeWidth={1} opacity={0.6} />
    <line x1={-20} y1={0} x2={40} y2={0}
      stroke={COLORS.neonMagenta} strokeWidth={0.8} opacity={0.4} />
  </g>
);

const DragonHead: React.FC<{ frame: number; phase: string }> = ({ frame, phase }) => {
  const jawOpen = phase === 'fireball'
    ? 25 + Math.sin(frame * 0.3) * 10
    : 8 + Math.sin(frame * 0.1) * 5;
  const eyeGlow = 0.6 + Math.sin(frame * 0.2) * 0.3;

  return (
    <g transform="translate(-130, -15)">
      {/* Neck */}
      <ellipse cx={50} cy={10} rx={50} ry={38} fill="url(#dragonBodyGrad)"
        stroke={COLORS.dragonRed} strokeWidth={1} />
      {/* Skull */}
      <path
        d={`M -80 -30 Q -130 -50 -100 10 Q -90 40 -30 30 Q 20 25 40 0 Q 50 -15 20 -40 Z`}
        fill="url(#dragonBodyGrad)"
        stroke={COLORS.dragonRed}
        strokeWidth={1.5}
      />
      {/* Lower jaw */}
      <path
        d={`M -80 ${10 + jawOpen * 0.2} Q -110 ${25 + jawOpen} -80 ${35 + jawOpen}
            Q -40 ${40 + jawOpen} -10 ${25 + jawOpen} Q 10 ${15 + jawOpen} 20 10 Z`}
        fill="url(#dragonBodyGrad)"
        stroke={COLORS.dragonRed}
        strokeWidth={1.5}
      />
      {/* Teeth - upper */}
      {[-95, -75, -55, -35].map((tx, i) => (
        <polygon key={i}
          points={`${tx},15 ${tx - 5},28 ${tx + 5},28`}
          fill="#cccccc"
          opacity={0.9}
        />
      ))}
      {/* Teeth - lower */}
      {[-90, -70, -50, -30].map((tx, i) => (
        <polygon key={i}
          points={`${tx},${14 + jawOpen} ${tx - 4},${2 + jawOpen} ${tx + 4},${2 + jawOpen}`}
          fill="#cccccc"
          opacity={0.9}
        />
      ))}
      {/* Eye - cyber implant */}
      <circle cx={-55} cy={-10} r={14} fill="#000000" stroke={COLORS.neonCyan} strokeWidth={2} />
      <circle cx={-55} cy={-10} r={8} fill={COLORS.dragonFire} opacity={eyeGlow} />
      <circle cx={-55} cy={-10} r={3} fill="#ffffff" opacity={0.9} />
      {/* Eye scan line */}
      <line x1={-70} y1={-10} x2={-40} y2={-10}
        stroke={COLORS.neonCyan} strokeWidth={0.8} opacity={eyeGlow * 0.7} />
      {/* Horns */}
      <path d="M -40 -30 Q -50 -80 -30 -90" fill="none"
        stroke={COLORS.bloodRed} strokeWidth={5} strokeLinecap="round" />
      <path d="M -60 -25 Q -85 -65 -70 -80" fill="none"
        stroke={COLORS.bloodRed} strokeWidth={4} strokeLinecap="round" />
      {/* Cyber horn glow */}
      <path d="M -40 -30 Q -50 -80 -30 -90" fill="none"
        stroke={COLORS.neonMagenta} strokeWidth={1} opacity={0.5} />
      {/* Fire breath */}
      {phase === 'fireball' && <FireBreath frame={frame} jawOpen={jawOpen} />}
    </g>
  );
};

const FireBreath: React.FC<{ frame: number; jawOpen: number }> = ({ frame, jawOpen }) => {
  const intensity = Math.sin(frame * 0.25) * 0.4 + 0.7;
  const stretch = 180 + Math.sin(frame * 0.3) * 40;

  return (
    <g filter="url(#fireGlow)">
      {/* Core beam */}
      <ellipse cx={-160} cy={20 + jawOpen / 2} rx={stretch} ry={18 * intensity}
        fill="url(#fireGrad)" opacity={0.9} />
      {/* Outer flame */}
      <ellipse cx={-170} cy={20 + jawOpen / 2} rx={stretch + 30} ry={28 * intensity}
        fill={COLORS.dragonFire} opacity={0.4} />
      {/* Flame particles */}
      {Array.from({ length: 8 }, (_, i) => {
        const px = -140 - i * 28 + Math.sin(frame * 0.3 + i) * 12;
        const py = 15 + jawOpen / 2 + Math.sin(frame * 0.2 + i * 1.3) * 15;
        return (
          <circle key={i} cx={px} cy={py}
            r={6 + Math.sin(frame * 0.4 + i) * 3}
            fill={i % 2 ? COLORS.dragonFire : '#ffff00'}
            opacity={0.7 - i * 0.06}
          />
        );
      })}
    </g>
  );
};

const CyberImplants: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = 0.5 + Math.sin(frame * 0.25) * 0.4;
  return (
    <g>
      {/* Spine cyber nodes */}
      {[0, 30, 60, 90].map((x, i) => (
        <circle key={i} cx={x} cy={-62} r={4}
          fill={COLORS.neonMagenta} opacity={pulse}
          filter="url(#fireGlow)" />
      ))}
      {/* Shoulder cyber mount */}
      <rect x={-15} y={-45} width={22} height={14}
        fill="#111111" stroke={COLORS.neonCyan} strokeWidth={1} rx={2}
        opacity={0.9} />
      <line x1={-10} y1={-38} x2={0} y2={-38}
        stroke={COLORS.neonCyan} strokeWidth={0.8} opacity={pulse} />
    </g>
  );
};
