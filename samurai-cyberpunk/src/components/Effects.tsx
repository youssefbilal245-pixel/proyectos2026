import { interpolate } from 'remotion';
import { COLORS } from '../colors';

interface ClashFlashProps {
  frame: number;
  active: boolean;
}

export const ClashFlash: React.FC<ClashFlashProps> = ({ frame, active }) => {
  if (!active) return null;
  const opacity = Math.max(0, 1 - frame * 0.12);
  const radius = 30 + frame * 12;

  return (
    <g>
      <defs>
        <radialGradient id="clashGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="30%" stopColor={COLORS.neonCyan} stopOpacity="0.8" />
          <stop offset="60%" stopColor={COLORS.neonMagenta} stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="clashBlur">
          <feGaussianBlur stdDeviation="15" />
        </filter>
      </defs>
      {/* Flash glow */}
      <circle cx={800} cy={500} r={radius * 2}
        fill={COLORS.neonCyan} opacity={opacity * 0.15}
        filter="url(#clashBlur)" />
      {/* Impact center */}
      <circle cx={800} cy={500} r={radius}
        fill="url(#clashGrad)" opacity={opacity * 0.8} />
      {/* Spark rays */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const len = radius * 1.5 + Math.sin(i * 1.7 + frame * 0.5) * 30;
        return (
          <line key={i}
            x1={800} y1={500}
            x2={800 + Math.cos(angle) * len}
            y2={500 + Math.sin(angle) * len}
            stroke={i % 2 ? COLORS.neonCyan : '#ffffff'}
            strokeWidth={2 + (i % 3)}
            opacity={opacity * 0.8}
            strokeLinecap="round"
          />
        );
      })}
      {/* Screen flash overlay */}
      <rect x={0} y={0} width={1920} height={1080}
        fill="#ffffff"
        opacity={Math.max(0, opacity * 0.25)} />
    </g>
  );
};

export const ParticleSystem: React.FC<{ frame: number; active: boolean; x: number; y: number }> = ({
  frame, active, x, y,
}) => {
  if (!active) return null;

  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2 + i * 0.3;
    const speed = 4 + (i % 5) * 2;
    const life = Math.max(0, 1 - frame * 0.04);
    return {
      px: x + Math.cos(angle) * speed * frame,
      py: y + Math.sin(angle) * speed * frame + frame * frame * 0.1,
      r: (3 - frame * 0.04) * life,
      color: i % 3 === 0 ? COLORS.neonCyan : i % 3 === 1 ? COLORS.neonMagenta : '#ffffff',
      opacity: life,
    };
  });

  return (
    <g>
      {particles.map((p, i) => (
        p.r > 0 && (
          <circle key={i}
            cx={p.px} cy={p.py} r={p.r}
            fill={p.color} opacity={p.opacity}
          />
        )
      ))}
    </g>
  );
};

export const LightningBolt: React.FC<{ frame: number; x1: number; y1: number; x2: number; y2: number; color?: string }> = ({
  frame, x1, y1, x2, y2, color = COLORS.neonCyan,
}) => {
  const opacity = 0.5 + Math.sin(frame * 0.4) * 0.4;
  const jitter = Array.from({ length: 5 }, (_, i) => ({
    x: x1 + (x2 - x1) * (i / 4) + (Math.sin(frame * 0.3 + i * 1.7) * 20),
    y: y1 + (y2 - y1) * (i / 4) + (Math.sin(frame * 0.4 + i * 2.1) * 20),
  }));

  const d = `M ${x1},${y1} ` + jitter.map(p => `L ${p.x},${p.y}`).join(' ') + ` L ${x2},${y2}`;

  return (
    <g opacity={opacity}>
      <defs>
        <filter id="lightningGlow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d={d} fill="none" stroke={color} strokeWidth={4}
        filter="url(#lightningGlow)" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#ffffff" strokeWidth={1.5}
        strokeLinecap="round" opacity={0.7} />
    </g>
  );
};

export const ScreenVignette: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => (
  <g>
    <defs>
      <radialGradient id="vigGrad" cx="50%" cy="50%" r="70%">
        <stop offset="50%" stopColor="transparent" />
        <stop offset="100%" stopColor="#000000" stopOpacity={0.85 * intensity} />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={1080} fill="url(#vigGrad)" />
  </g>
);

export const ChromaticAberration: React.FC<{ frame: number; intensity?: number }> = ({
  frame, intensity = 1,
}) => {
  const shift = Math.sin(frame * 0.15) * 3 * intensity;
  return (
    <g opacity={0.08 * intensity} style={{ mixBlendMode: 'screen' }}>
      <rect x={shift} y={0} width={1920} height={1080}
        fill="red" opacity={0.15} />
      <rect x={-shift} y={0} width={1920} height={1080}
        fill="cyan" opacity={0.15} />
    </g>
  );
};

export const ScanLines: React.FC = () => (
  <g opacity={0.04}>
    {Array.from({ length: 54 }, (_, i) => (
      <rect key={i} x={0} y={i * 20} width={1920} height={1}
        fill="#ffffff" />
    ))}
  </g>
);

export const EnergyGround: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = 0.3 + Math.sin(frame * 0.12) * 0.2;
  return (
    <g>
      {/* Ground cracks with neon glow */}
      {[
        'M 300 870 Q 450 865 600 875 Q 700 880 800 870',
        'M 700 875 Q 800 868 950 878 Q 1050 882 1150 872',
        'M 500 880 Q 550 895 600 885 Q 650 875 700 890',
        'M 850 872 Q 900 888 960 878 Q 1020 868 1100 882',
      ].map((d, i) => (
        <g key={i}>
          <path d={d} fill="none"
            stroke={i % 2 ? COLORS.neonCyan : COLORS.neonMagenta}
            strokeWidth={3} opacity={pulse * 0.6}
            filter="url(#lightningGlow)" />
          <path d={d} fill="none"
            stroke="#ffffff" strokeWidth={0.8} opacity={pulse * 0.3} />
        </g>
      ))}
      {/* Energy puddles */}
      {[
        { cx: 480, cy: 885, rx: 80, ry: 15 },
        { cx: 760, cy: 878, rx: 60, ry: 12 },
        { cx: 1000, cy: 882, rx: 50, ry: 10 },
      ].map((e, i) => (
        <ellipse key={i}
          cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry}
          fill={i % 2 ? COLORS.neonCyan : COLORS.neonMagenta}
          opacity={pulse * 0.25}
          filter="url(#lightningGlow)"
        />
      ))}
    </g>
  );
};

export const TitleOverlay: React.FC<{ frame: number; show: boolean }> = ({ frame, show }) => {
  if (!show) return null;
  const opacity = interpolate(frame, [0, 20, 80, 100], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const glitch = Math.sin(frame * 0.7) > 0.85 ? Math.random() * 4 - 2 : 0;

  return (
    <g opacity={opacity}>
      <defs>
        <filter id="textGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Background bar */}
      <rect x={160} y={900} width={1600} height={110}
        fill="#000000" opacity={0.7} />
      <rect x={160} y={900} width={1600} height={2}
        fill={COLORS.neonCyan} opacity={0.9} />
      <rect x={160} y={1008} width={1600} height={2}
        fill={COLORS.neonMagenta} opacity={0.9} />

      {/* Main title */}
      <text
        x={960 + glitch} y={968}
        textAnchor="middle"
        fontFamily="monospace"
        fontSize={48}
        fontWeight="bold"
        fill={COLORS.neonCyan}
        filter="url(#textGlow)"
        letterSpacing="8"
      >
        侍 × CYBER DRAGON — EDO 2187
      </text>
      {/* Subtitle */}
      <text
        x={960} y={1000}
        textAnchor="middle"
        fontFamily="monospace"
        fontSize={16}
        fill={COLORS.neonMagenta}
        letterSpacing="4"
        opacity={0.8}
      >
        DYSTOPIAN BATTLE SEQUENCE // CLASSIFIED
      </text>
    </g>
  );
};
