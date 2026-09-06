import { memo } from 'react';
import Svg, { Circle, G, Line, Path } from 'react-native-svg';

import type { InstrumentId } from '../data/tunings';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  instrument: InstrumentId;
  activeIndex: number | null;
  inTune: boolean;
};

function strokeFor(index: number, activeIndex: number | null, ink: string, accent: string, soft: string) {
  if (activeIndex == null) {
    return ink;
  }
  return activeIndex === index ? accent : soft;
}

function GuitarArt({ ink, soft, accent, activeIndex }: { ink: string; soft: string; accent: string; activeIndex: number | null }) {
  const strings = [78, 86, 94, 102, 110, 118];
  return (
    <>
      <Path
        d="M64 168
           C40 168 28 190 28 214
           C28 248 52 268 80 268
           C92 268 100 258 110 258
           C120 258 128 268 140 268
           C168 268 192 248 192 214
           C192 190 180 168 156 168
           Z"
        fill="none"
        stroke={ink}
        strokeWidth="1.15"
      />
      <Circle cx="110" cy="214" r="18" fill="none" stroke={ink} strokeWidth="1.05" />
      <Circle cx="110" cy="214" r="3" fill="none" stroke={soft} strokeWidth="0.9" />
      <Path d="M100 168 V78 H120 V168" fill="none" stroke={ink} strokeWidth="1.15" />
      <Path
        d="M96 78 H124
           C136 78 142 58 132 46
           C124 38 110 34 110 34
           C110 34 96 38 88 46
           C78 58 84 78 96 78Z"
        fill="none"
        stroke={ink}
        strokeWidth="1.15"
      />
      <Line x1="100" y1="78" x2="120" y2="78" stroke={ink} strokeWidth="1.6" />
      {strings.map((x, index) => (
        <Line
          key={x}
          x1={x}
          y1={78}
          x2={x}
          y2={252}
          stroke={strokeFor(index, activeIndex, ink, accent, soft)}
          strokeWidth={index === activeIndex ? 1.5 : 0.7}
        />
      ))}
      {[
        [86, 48],
        [86, 58],
        [86, 68],
        [134, 48],
        [134, 58],
        [134, 68],
      ].map(([x, y], index) => (
        <Circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill="none" stroke={strokeFor(index, activeIndex, ink, accent, soft)} />
      ))}
    </>
  );
}

function BassArt({ ink, soft, accent, activeIndex }: { ink: string; soft: string; accent: string; activeIndex: number | null }) {
  const strings = [88, 98, 108, 118];
  return (
    <>
      <Path
        d="M58 176
           C30 176 22 198 22 222
           C22 254 50 274 86 274
           C100 274 108 262 120 262
           C132 262 140 274 154 274
           C186 274 200 248 200 222
           C200 196 186 176 162 176
           Z"
        fill="none"
        stroke={ink}
        strokeWidth="1.15"
      />
      <Circle cx="92" cy="214" r="10" fill="none" stroke={soft} strokeWidth="0.9" />
      <Circle cx="128" cy="214" r="10" fill="none" stroke={soft} strokeWidth="0.9" />
      <Path d="M96 176 V62 H124 V176" fill="none" stroke={ink} strokeWidth="1.15" />
      <Path d="M94 62 H126 V38 C126 28 110 22 110 22 C110 22 94 28 94 38 Z" fill="none" stroke={ink} strokeWidth="1.15" />
      <Line x1="96" y1="62" x2="124" y2="62" stroke={ink} strokeWidth="1.6" />
      {strings.map((x, index) => (
        <Line
          key={x}
          x1={x}
          y1={62}
          x2={x}
          y2={258}
          stroke={strokeFor(index, activeIndex, ink, accent, soft)}
          strokeWidth={index === activeIndex ? 1.6 : 0.85}
        />
      ))}
    </>
  );
}

function SazArt({ ink, soft, accent, activeIndex }: { ink: string; soft: string; accent: string; activeIndex: number | null }) {
  const courses = [100, 110, 120];
  return (
    <>
      <Path
        d="M110 278
           C168 270 196 230 188 188
           C180 146 148 128 110 128
           C72 128 40 146 32 188
           C24 230 52 270 110 278Z"
        fill="none"
        stroke={ink}
        strokeWidth="1.15"
      />
      <Circle cx="110" cy="196" r="22" fill="none" stroke={ink} strokeWidth="1" />
      <Circle cx="110" cy="196" r="4" fill="none" stroke={soft} strokeWidth="0.9" />
      <Path d="M103 128 V36 H117 V128" fill="none" stroke={ink} strokeWidth="1.1" />
      <Path d="M100 36 H120 V22 C116 14 104 12 110 12 C116 12 104 14 100 22 Z" fill="none" stroke={ink} strokeWidth="1.1" />
      {courses.map((x, index) => (
        <G key={x}>
          <Line
            x1={x - 1.4}
            y1={36}
            x2={x - 1.4}
            y2={248}
            stroke={strokeFor(index, activeIndex, ink, accent, soft)}
            strokeWidth={0.7}
          />
          <Line
            x1={x + 1.4}
            y1={36}
            x2={x + 1.4}
            y2={248}
            stroke={strokeFor(index, activeIndex, ink, accent, soft)}
            strokeWidth={0.7}
          />
        </G>
      ))}
    </>
  );
}

function UkeArt({ ink, soft, accent, activeIndex }: { ink: string; soft: string; accent: string; activeIndex: number | null }) {
  const strings = [92, 102, 112, 122];
  return (
    <>
      <Path
        d="M70 168
           C48 168 40 186 44 206
           C48 228 70 242 90 242
           C100 242 106 234 110 234
           C114 234 120 242 130 242
           C150 242 172 228 176 206
           C180 186 172 168 150 168
           Z"
        fill="none"
        stroke={ink}
        strokeWidth="1.15"
      />
      <Circle cx="110" cy="204" r="16" fill="none" stroke={ink} strokeWidth="1" />
      <Path d="M100 168 V92 H120 V168" fill="none" stroke={ink} strokeWidth="1.1" />
      <Path d="M97 92 H123 C130 92 134 74 124 66 C116 60 104 58 110 58 C116 58 104 60 96 66 C86 74 90 92 97 92Z" fill="none" stroke={ink} strokeWidth="1.1" />
      {strings.map((x, index) => (
        <Line
          key={x}
          x1={x}
          y1={92}
          x2={x}
          y2={232}
          stroke={strokeFor(index, activeIndex, ink, accent, soft)}
          strokeWidth={index === activeIndex ? 1.4 : 0.7}
        />
      ))}
    </>
  );
}

function AutoArt({ ink, soft }: { ink: string; soft: string; accent: string; note: string; octave: string }) {
  const dots = Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * Math.PI * 2 - Math.PI / 2;
    return { x: 110 + Math.cos(angle) * 58, y: 150 + Math.sin(angle) * 58, on: i % 4 === 0 };
  });
  return (
    <>
      <Circle cx="110" cy="150" r="86" fill="none" stroke={soft} strokeWidth="0.7" />
      <Circle cx="110" cy="150" r="72" fill="none" stroke={ink} strokeWidth="1" />
      <Circle cx="110" cy="150" r="46" fill="none" stroke={soft} strokeWidth="0.8" />
      <Circle cx="110" cy="150" r="18" fill="none" stroke={ink} strokeWidth="1.1" />
      {dots.map((dot, index) => (
        <Circle
          key={index}
          cx={dot.x}
          cy={dot.y}
          r={dot.on ? 1.6 : 0.8}
          fill={dot.on ? ink : soft}
        />
      ))}
    </>
  );
}

function InstrumentArtComponent({ instrument, activeIndex, inTune }: Props) {
  const { theme } = useTheme();
  const ink = theme.ink;
  const soft = theme.inkSoft;
  const accent = inTune ? theme.accent : theme.ink;

  return (
    <Svg width="100%" height="100%" viewBox="0 0 220 300">
      {instrument === 'guitar' ? (
        <GuitarArt ink={ink} soft={soft} accent={accent} activeIndex={activeIndex} />
      ) : null}
      {instrument === 'bass' ? (
        <BassArt ink={ink} soft={soft} accent={accent} activeIndex={activeIndex} />
      ) : null}
      {instrument === 'saz' ? (
        <SazArt ink={ink} soft={soft} accent={accent} activeIndex={activeIndex} />
      ) : null}
      {instrument === 'ukulele' ? (
        <UkeArt ink={ink} soft={soft} accent={accent} activeIndex={activeIndex} />
      ) : null}
      {instrument === 'auto' ? (
        <AutoArt ink={ink} soft={soft} accent={accent} note="" octave="" />
      ) : null}
    </Svg>
  );
}

export const InstrumentArt = memo(InstrumentArtComponent);
