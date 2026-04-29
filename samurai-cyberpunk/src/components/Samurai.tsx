import { interpolate } from 'remotion';
import { COLORS } from '../colors';

interface SamuraiProps {
  frame: number;
  phase: 'idle' | 'charge' | 'slash' | 'block' | 'stance';
}

export const Samurai: React.FC<SamuraiProps> = ({ frame, phase }) => {
  const breathe = Math.sin(frame * 0.08) * 3;
  const swordGlow = 0.6 + Math.sin(frame * 0.18) * 0.35;

  let posX = 0;
  let posY = 0;

  if (phase === 'charge') {
    posX = interpolate(frame, [0, 25], [0, 80], { extrapolateRight: 'clamp' });
    posY = interpolate(frame, [0, 25], [0, -15], { extrapolateRight: 'clamp' });
  } else if (phase === 'slash') {
    posX = interpolate(frame, [0, 10, 20], [80, 100, 60], { extrapolateRight: 'clamp' });
    posY = interpolate(frame, [0, 5, 20], [-15, -30, 0], { extrapolateRight: 'clamp' });
  }

  return (
    <g transform={`translate(${480 + posX}, ${620 + posY + breathe})`}>
      <defs>
        <linearGradient id="armorGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a0a1a" />
          <stop offset="50%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#050510" />
        </linearGradient>
        <linearGradient id="swordGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor={COLORS.neonCyan} />
          <stop offset="70%" stopColor={COLORS.electricBlue} />
          <stop offset="100%" stopColor="#002266" />
        </linearGradient>
        <filter id="swordGlow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="armorGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="samuraiAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.neonCyan} stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Aura */}
      <ellipse cx={0} cy={-80} rx={120} ry={200}
        fill="url(#samuraiAura)" opacity={swordGlow * 0.5} />

      {/* Shadow */}
      <ellipse cx={0} cy={195} rx={70} ry={18}
        fill="#000000" opacity={0.6} />

      {/* Legs / Hakama */}
      <Hakama frame={frame} phase={phase} />

      {/* Torso - Chest armor (do) */}
      <ChestArmor frame={frame} phase={phase} />

      {/* Left arm */}
      <Arm side="left" frame={frame} />

      {/* Right arm (sword arm) */}
      <SwordArm frame={frame} phase={phase} swordGlow={swordGlow} />

      {/* Shoulders */}
      <Shoulder side="left" />
      <Shoulder side="right" />

      {/* Head + Helmet */}
      <Head frame={frame} />

      {/* Katana energy trail */}
      {(phase === 'slash' || phase === 'charge') && (
        <SwordTrail frame={frame} />
      )}
    </g>
  );
};

const Hakama: React.FC<{ frame: number; phase: string }> = ({ frame, phase }) => {
  const legSwing = phase === 'charge' || phase === 'slash'
    ? Math.sin(frame * 0.35) * 18
    : Math.sin(frame * 0.06) * 4;

  return (
    <g>
      {/* Hakama skirt */}
      <path d={`M -45 80 Q -50 130 -55 190 L 55 190 Q 50 130 45 80 Z`}
        fill="url(#armorGrad)"
        stroke={COLORS.neonCyan}
        strokeWidth={0.8}
        opacity={0.95}
      />
      {/* Hakama folds */}
      {[-30, -15, 0, 15, 30].map((x, i) => (
        <line key={i} x1={x} y1={82} x2={x + (i - 2) * 3} y2={188}
          stroke={COLORS.neonCyan} strokeWidth={0.5} opacity={0.3} />
      ))}
      {/* Left leg */}
      <rect x={-40} y={188} width={35} height={60}
        fill="url(#armorGrad)" stroke={COLORS.neonCyan} strokeWidth={0.8}
        transform={`rotate(${legSwing}, -22, 188)`} />
      {/* Right leg */}
      <rect x={5} y={188} width={35} height={60}
        fill="url(#armorGrad)" stroke={COLORS.neonCyan} strokeWidth={0.8}
        transform={`rotate(${-legSwing}, 22, 188)`} />
      {/* Boots */}
      <rect x={-42} y={240} width={38} height={22}
        fill="#111111" stroke={COLORS.neonMagenta} strokeWidth={1} rx={3}
        transform={`rotate(${legSwing}, -22, 248)`} />
      <rect x={3} y={240} width={38} height={22}
        fill="#111111" stroke={COLORS.neonMagenta} strokeWidth={1} rx={3}
        transform={`rotate(${-legSwing}, 22, 248)`} />
      {/* Boot neon lines */}
      <line x1={-38} y1={252} x2={-8} y2={252}
        stroke={COLORS.neonCyan} strokeWidth={1} opacity={0.6}
        transform={`rotate(${legSwing}, -22, 248)`} />
      <line x1={7} y1={252} x2={37} y2={252}
        stroke={COLORS.neonCyan} strokeWidth={1} opacity={0.6}
        transform={`rotate(${-legSwing}, 22, 248)`} />
    </g>
  );
};

const ChestArmor: React.FC<{ frame: number; phase: string }> = ({ frame, phase }) => {
  const glowPulse = 0.5 + Math.sin(frame * 0.15) * 0.4;
  return (
    <g>
      {/* Main torso */}
      <rect x={-42} y={-10} width={84} height={92}
        fill="url(#armorGrad)" stroke={COLORS.neonCyan} strokeWidth={1.5} rx={4} />
      {/* Chest plate sections */}
      <rect x={-35} y={-5} width={70} height={38}
        fill="#0d0d1f" stroke={COLORS.neonCyan} strokeWidth={1} rx={3} />
      {/* Mon (clan symbol) - geometric cyber version */}
      <polygon
        points="0,-22 18,-10 18,10 0,22 -18,10 -18,-10"
        fill="none"
        stroke={COLORS.neonCyan}
        strokeWidth={1.5}
        transform="translate(0, 16)"
        opacity={glowPulse}
        filter="url(#armorGlow)"
      />
      <circle cx={0} cy={16} r={5}
        fill={COLORS.neonCyan} opacity={glowPulse}
        filter="url(#armorGlow)" />
      {/* Armor vertical ridges */}
      {[-20, 0, 20].map((x, i) => (
        <line key={i} x1={x} y1={38} x2={x} y2={80}
          stroke={COLORS.neonCyan} strokeWidth={0.7} opacity={0.4} />
      ))}
      {/* Waist armor (koshiate) */}
      <rect x={-45} y={78} width={90} height={18}
        fill="#0d0d1f" stroke={COLORS.neonMagenta} strokeWidth={1} rx={2} />
      {/* Tassets */}
      {[-1, 0, 1].map((i) => (
        <rect key={i}
          x={i * 28 - 18} y={92}
          width={28} height={22}
          fill="url(#armorGrad)"
          stroke={COLORS.neonCyan}
          strokeWidth={0.8}
          rx={2}
          opacity={0.9}
        />
      ))}
      {/* Energy conduits */}
      <line x1={-38} y1={0} x2={-38} y2={78}
        stroke={COLORS.neonMagenta} strokeWidth={1.5} opacity={glowPulse * 0.7} />
      <line x1={38} y1={0} x2={38} y2={78}
        stroke={COLORS.neonMagenta} strokeWidth={1.5} opacity={glowPulse * 0.7} />
    </g>
  );
};

const Arm: React.FC<{ side: 'left' | 'right'; frame: number }> = ({ side, frame }) => {
  const mult = side === 'left' ? -1 : 1;
  const swing = Math.sin(frame * 0.07) * 8 * mult;
  const x = side === 'left' ? -55 : 43;

  return (
    <g transform={`rotate(${swing}, ${x + 12}, 0)`}>
      {/* Upper arm */}
      <rect x={x} y={-8} width={24} height={50}
        fill="url(#armorGrad)" stroke={COLORS.neonCyan} strokeWidth={1} rx={4} />
      {/* Elbow guard */}
      <ellipse cx={x + 12} cy={46} rx={14} ry={8}
        fill="#0d0d1f" stroke={COLORS.neonMagenta} strokeWidth={1} />
      {/* Forearm */}
      <rect x={x + 1} y={50} width={22} height={44}
        fill="url(#armorGrad)" stroke={COLORS.neonCyan} strokeWidth={1} rx={3} />
      {/* Kote (forearm guard) */}
      <rect x={x - 1} y={52} width={26} height={12}
        fill="#0d0d1f" stroke={COLORS.neonCyan} strokeWidth={0.8} rx={2} />
      {/* Cyber line */}
      <line x1={x + 12} y1={52} x2={x + 12} y2={92}
        stroke={COLORS.neonCyan} strokeWidth={0.8} opacity={0.5} />
    </g>
  );
};

const SwordArm: React.FC<{ frame: number; phase: string; swordGlow: number }> = ({ frame, phase, swordGlow }) => {
  let armRotation = -15;
  let swordAngle = -50;

  if (phase === 'idle' || phase === 'stance') {
    armRotation = -15 + Math.sin(frame * 0.07) * 5;
    swordAngle = -45 + Math.sin(frame * 0.07) * 5;
  } else if (phase === 'charge') {
    const t = Math.min(frame / 25, 1);
    armRotation = -15 + t * (-60);
    swordAngle = -45 + t * (-90);
  } else if (phase === 'slash') {
    const t = Math.min(frame / 10, 1);
    const t2 = Math.max((frame - 10) / 10, 0);
    armRotation = -75 + t * 120 - t2 * 40;
    swordAngle = -135 + t * 150 - t2 * 60;
  }

  return (
    <g transform={`rotate(${armRotation}, 55, 0)`}>
      {/* Upper arm */}
      <rect x={43} y={-8} width={24} height={50}
        fill="url(#armorGrad)" stroke={COLORS.neonCyan} strokeWidth={1} rx={4} />
      {/* Elbow */}
      <ellipse cx={55} cy={46} rx={14} ry={8}
        fill="#0d0d1f" stroke={COLORS.neonMagenta} strokeWidth={1} />
      {/* Forearm */}
      <rect x={44} y={50} width={22} height={44}
        fill="url(#armorGrad)" stroke={COLORS.neonCyan} strokeWidth={1} rx={3} />
      <rect x={42} y={52} width={26} height={12}
        fill="#0d0d1f" stroke={COLORS.neonCyan} strokeWidth={0.8} rx={2} />
      {/* Tsuka (handle) */}
      <g transform={`rotate(${swordAngle - armRotation}, 55, 93)`}>
        <rect x={50} y={90} width={10} height={35}
          fill="#1a1a2e" stroke={COLORS.gold} strokeWidth={1} rx={2} />
        {/* Tsuba (guard) */}
        <ellipse cx={55} cy={122} rx={18} ry={8}
          fill="#0d0d1f" stroke={COLORS.gold} strokeWidth={1.5} />
        {/* Cyber tsuba glow */}
        <ellipse cx={55} cy={122} rx={14} ry={5}
          fill="none" stroke={COLORS.neonCyan} strokeWidth={0.8}
          opacity={swordGlow} filter="url(#swordGlow)" />
        {/* Blade */}
        <defs>
          <linearGradient id="bladeShine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS.neonCyan} stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor={COLORS.electricBlue} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <polygon
          points="52,122 58,122 57,240 55,248 53,240"
          fill="url(#swordGrad)"
          filter="url(#swordGlow)"
          opacity={0.95}
        />
        {/* Blade glow */}
        <polygon
          points="51,122 59,122 58,240 55,248 52,240"
          fill={COLORS.neonCyan}
          opacity={swordGlow * 0.4}
          filter="url(#swordGlow)"
        />
        {/* Hi (blood groove) */}
        <line x1={55} y1={126} x2={55.5} y2={238}
          stroke="url(#bladeShine)" strokeWidth={1.5} opacity={0.7} />
        {/* Blade energy particles */}
        {Array.from({ length: 5 }, (_, i) => (
          <circle key={i}
            cx={54 + (i % 2) * 2}
            cy={135 + i * 22}
            r={2}
            fill={COLORS.neonCyan}
            opacity={swordGlow * (1 - i * 0.15)}
            filter="url(#swordGlow)"
          />
        ))}
      </g>
    </g>
  );
};

const Shoulder: React.FC<{ side: 'left' | 'right' }> = ({ side }) => {
  const x = side === 'left' ? -72 : 50;
  const mirrorX = side === 'left' ? -1 : 1;
  return (
    <g transform={`scale(${mirrorX}, 1) translate(${side === 'left' ? 72 : -50}, 0)`}>
      {/* O-sode (large shoulder plate) */}
      <path d={`M ${x} -15 Q ${x + 5} -30 ${x + 25} -28 L ${x + 30} 20 Q ${x + 20} 28 ${x} 22 Z`}
        fill="url(#armorGrad)"
        stroke={COLORS.neonCyan}
        strokeWidth={1.5}
        transform={`scale(${mirrorX}, 1) translate(${side === 'left' ? -72 : 50}, 0)`}
      />
      {/* Shoulder neon accent */}
      <line x1={x + 5} y1={-20} x2={x + 25} y2={15}
        stroke={COLORS.neonMagenta}
        strokeWidth={1}
        opacity={0.6}
        transform={`scale(${mirrorX}, 1) translate(${side === 'left' ? -72 : 50}, 0)`}
      />
    </g>
  );
};

const Head: React.FC<{ frame: number }> = ({ frame }) => {
  const headTilt = Math.sin(frame * 0.05) * 3;
  const visorGlow = 0.7 + Math.sin(frame * 0.2) * 0.25;

  return (
    <g transform={`rotate(${headTilt}, 0, -50)`}>
      {/* Neck */}
      <rect x={-12} y={-22} width={24} height={20}
        fill="url(#armorGrad)" stroke={COLORS.neonCyan} strokeWidth={0.8} />
      {/* Kabuto (helmet) - main dome */}
      <ellipse cx={0} cy={-68} rx={38} ry={42}
        fill="url(#armorGrad)" stroke={COLORS.neonCyan} strokeWidth={1.5} />
      {/* Fukigaeshi (ear flaps) */}
      <path d="M -38 -62 Q -55 -55 -50 -35 Q -48 -25 -35 -28 L -35 -62 Z"
        fill="url(#armorGrad)" stroke={COLORS.neonCyan} strokeWidth={1} />
      <path d="M 38 -62 Q 55 -55 50 -35 Q 48 -25 35 -28 L 35 -62 Z"
        fill="url(#armorGrad)" stroke={COLORS.neonCyan} strokeWidth={1} />
      {/* Shikoro (neck guard) */}
      <path d="M -42 -32 Q -50 -10 -45 5 L 45 5 Q 50 -10 42 -32 Z"
        fill="url(#armorGrad)" stroke={COLORS.neonCyan} strokeWidth={1} />
      {/* Maedate (crest) - cyber katana shape */}
      <line x1={0} y1={-108} x2={0} y2={-85}
        stroke={COLORS.neonCyan} strokeWidth={3}
        filter="url(#armorGlow)" />
      <polygon points="0,-118 5,-108 -5,-108"
        fill={COLORS.neonCyan} filter="url(#armorGlow)" />
      {/* Visor - T-shape */}
      <rect x={-30} y={-76} width={60} height={16}
        fill="#000000" stroke={COLORS.neonMagenta} strokeWidth={1.5} rx={3} />
      {/* Visor glow */}
      <rect x={-28} y={-74} width={56} height={12}
        fill={COLORS.neonMagenta} opacity={visorGlow * 0.4} rx={2}
        filter="url(#armorGlow)" />
      {/* Visor scan line */}
      <rect x={-28}
        y={-74 + ((frame * 2) % 12)}
        width={56} height={2}
        fill={COLORS.neonMagenta}
        opacity={0.6}
        rx={1}
      />
      {/* Menpo (face guard) */}
      <path d="M -28 -60 Q -30 -45 -25 -32 L 25 -32 Q 30 -45 28 -60 Z"
        fill="url(#armorGrad)" stroke={COLORS.neonCyan} strokeWidth={1} />
      {/* Demon face on menpo */}
      {/* Eyes */}
      <circle cx={-12} cy={-50} r={5}
        fill={COLORS.neonCyan} opacity={visorGlow}
        filter="url(#armorGlow)" />
      <circle cx={12} cy={-50} r={5}
        fill={COLORS.neonCyan} opacity={visorGlow}
        filter="url(#armorGlow)" />
      {/* Nose grill */}
      {[-6, -2, 2, 6].map((x, i) => (
        <line key={i} x1={x} y1={-43} x2={x} y2={-37}
          stroke={COLORS.neonMagenta} strokeWidth={1} opacity={0.5} />
      ))}
      {/* Helmet ridges / Suji */}
      {[-20, -10, 0, 10, 20].map((x, i) => (
        <line key={i} x1={x} y1={-108} x2={x * 1.2} y2={-30}
          stroke={COLORS.neonCyan} strokeWidth={0.6} opacity={0.25} />
      ))}
    </g>
  );
};

const SwordTrail: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = Math.max(0, 1 - frame * 0.08);
  return (
    <g opacity={opacity * 0.6} filter="url(#swordGlow)">
      <path
        d="M 80 -80 Q 150 50 120 180"
        fill="none"
        stroke={COLORS.neonCyan}
        strokeWidth={20}
        strokeLinecap="round"
        opacity={0.15}
      />
      <path
        d="M 85 -70 Q 155 55 125 175"
        fill="none"
        stroke="#ffffff"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.6}
      />
    </g>
  );
};
