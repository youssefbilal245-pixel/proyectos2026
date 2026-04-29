import { useCurrentFrame, interpolate } from 'remotion';
import { Background } from './components/Background';
import { Dragon } from './components/Dragon';
import { Samurai } from './components/Samurai';
import {
  ClashFlash,
  ParticleSystem,
  LightningBolt,
  ScreenVignette,
  ChromaticAberration,
  ScanLines,
  EnergyGround,
  TitleOverlay,
} from './components/Effects';
import { COLORS } from './colors';

// Timeline (at 30fps):
// 0-60    — Intro: dragon approaches through storm, samurai readies stance
// 60-120  — Confrontation: face-off, lightning, tension
// 120-180 — First clash: charge + slash
// 180-240 — Dragon fireball + samurai block/dodge
// 240-360 — Final showdown + climax

type DragonPhase = 'approach' | 'battle' | 'fireball' | 'retreat';
type SamuraiPhase = 'idle' | 'charge' | 'slash' | 'block' | 'stance';

function getDragonPhase(frame: number): DragonPhase {
  if (frame < 60) return 'approach';
  if (frame < 180) return 'battle';
  if (frame < 270) return 'fireball';
  return 'battle';
}

function getDragonLocalFrame(frame: number): number {
  if (frame < 60) return frame;
  if (frame < 180) return frame - 60;
  if (frame < 270) return frame - 180;
  return frame - 270;
}

function getSamuraiPhase(frame: number): SamuraiPhase {
  if (frame < 60) return 'stance';
  if (frame < 120) return 'idle';
  if (frame < 145) return 'charge';
  if (frame < 175) return 'slash';
  if (frame < 240) return 'block';
  if (frame < 280) return 'charge';
  if (frame < 320) return 'slash';
  return 'stance';
}

function getSamuraiLocalFrame(frame: number): number {
  if (frame < 60) return frame;
  if (frame < 120) return frame - 60;
  if (frame < 145) return frame - 120;
  if (frame < 175) return frame - 145;
  if (frame < 240) return frame - 175;
  if (frame < 280) return frame - 240;
  if (frame < 320) return frame - 280;
  return frame - 320;
}

export const SamuraiCyberpunk: React.FC = () => {
  const frame = useCurrentFrame();

  const dragonPhase = getDragonPhase(frame);
  const dragonLocalFrame = getDragonLocalFrame(frame);
  const samuraiPhase = getSamuraiPhase(frame);
  const samuraiLocalFrame = getSamuraiLocalFrame(frame);

  const isClash1 = frame >= 145 && frame < 160;
  const isClash2 = frame >= 280 && frame < 295;
  const clashFrame1 = isClash1 ? frame - 145 : 0;
  const clashFrame2 = isClash2 ? frame - 280 : 0;

  const isFireball = frame >= 195 && frame < 210;

  const shakeActive = isClash1 || isClash2 || isFireball;
  const shakeX = shakeActive ? Math.sin(frame * 3.7) * 8 : 0;
  const shakeY = shakeActive ? Math.cos(frame * 2.9) * 6 : 0;

  const battleDark = frame > 60 ? 0.15 + Math.sin(frame * 0.08) * 0.1 : 0;
  const showLightning = frame >= 90 && frame < 130;
  const showTitle = frame >= 10 && frame < 110;
  const aberrationIntensity = shakeActive ? 3 : 1;
  const fogOpacity = interpolate(
    frame,
    [0, 30, 300, 360],
    [0, 0.4, 0.4, 0.7],
    { extrapolateRight: 'clamp' }
  );

  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform={`translate(${shakeX}, ${shakeY})`}>
        <Background frame={frame} />

        <rect x={0} y={0} width={1920} height={1080}
          fill="#110022" opacity={fogOpacity * 0.3} />

        <EnergyGround frame={frame} />

        {showLightning && (
          <g>
            <LightningBolt frame={frame - 90} x1={560} y1={580} x2={1300} y2={380} color={COLORS.neonCyan} />
            <LightningBolt frame={frame - 90 + 3} x1={600} y1={560} x2={1280} y2={400} color={COLORS.neonMagenta} />
          </g>
        )}

        <Dragon frame={dragonLocalFrame} phase={dragonPhase} />
        <Samurai frame={samuraiLocalFrame} phase={samuraiPhase} />

        <ClashFlash frame={clashFrame1} active={isClash1} />
        <ClashFlash frame={clashFrame2} active={isClash2} />

        <ParticleSystem frame={clashFrame1} active={isClash1} x={820} y={490} />
        <ParticleSystem frame={clashFrame2} active={isClash2} x={780} y={510} />

        {isFireball && (
          <g>
            <ClashFlash frame={frame - 195} active />
            <ellipse
              cx={560 + (frame - 195) * 5}
              cy={600 + Math.sin((frame - 195) * 0.5) * 20}
              rx={40 + (frame - 195) * 8}
              ry={30 + (frame - 195) * 5}
              fill={COLORS.dragonFire}
              opacity={Math.max(0, 1 - (frame - 195) * 0.1)}
            />
          </g>
        )}

        <rect x={0} y={0} width={1920} height={1080}
          fill="#000022" opacity={battleDark} />

        <ScreenVignette intensity={1.2} />
        <ScanLines />
        <ChromaticAberration frame={frame} intensity={aberrationIntensity} />

        <HUD frame={frame} />
        <TitleOverlay frame={frame - 10} show={showTitle} />
      </g>
    </svg>
  );
};

const HUD: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = 0.6 + Math.sin(frame * 0.15) * 0.3;

  return (
    <g opacity={opacity}>
      <text x={40} y={50} fill={COLORS.neonCyan}
        fontFamily="monospace" fontSize={13} opacity={0.7} letterSpacing={2}>
        SYS://BATTLE.LOG — FRAME {frame.toString().padStart(4, '0')}
      </text>
      <text x={40} y={70} fill={COLORS.neonMagenta}
        fontFamily="monospace" fontSize={11} opacity={0.5} letterSpacing={2}>
        LOC: TOKYO-RUINS // SEC: OMEGA-7 // THREAT: CRITICAL
      </text>

      {frame > 60 && (
        <g transform="translate(1360, 280)">
          <circle cx={0} cy={0} r={60}
            fill="none" stroke={COLORS.neonMagenta}
            strokeWidth={1} opacity={pulse * 0.7}
            strokeDasharray="8 4" />
          <circle cx={0} cy={0} r={40}
            fill="none" stroke={COLORS.neonCyan}
            strokeWidth={0.8} opacity={pulse * 0.5} />
          <line x1={-70} y1={0} x2={-45} y2={0}
            stroke={COLORS.neonMagenta} strokeWidth={1} opacity={pulse} />
          <line x1={45} y1={0} x2={70} y2={0}
            stroke={COLORS.neonMagenta} strokeWidth={1} opacity={pulse} />
          <line x1={0} y1={-70} x2={0} y2={-45}
            stroke={COLORS.neonMagenta} strokeWidth={1} opacity={pulse} />
          <line x1={0} y1={45} x2={0} y2={70}
            stroke={COLORS.neonMagenta} strokeWidth={1} opacity={pulse} />
          <text x={72} y={4} fill={COLORS.neonMagenta}
            fontFamily="monospace" fontSize={11} opacity={0.7}>
            TARGET LOCKED
          </text>
        </g>
      )}

      <text x={1870} y={1050} fill={COLORS.neonCyan}
        fontFamily="monospace" fontSize={11}
        textAnchor="end" opacity={0.5} letterSpacing={1}>
        35.6762°N 139.6503°E // YEAR 2187
      </text>

      {frame > 100 && (
        <g transform="translate(1800, 80)">
          <rect x={0} y={0} width={90} height={28}
            fill="#000000" stroke={COLORS.dragonFire}
            strokeWidth={1} rx={2} opacity={0.8} />
          <text x={45} y={19} textAnchor="middle"
            fill={COLORS.dragonFire}
            fontFamily="monospace" fontSize={13}
            fontWeight="bold" letterSpacing={2}
            opacity={pulse}>
            ⚠ DANGER
          </text>
        </g>
      )}
    </g>
  );
};
