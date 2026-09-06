import Svg, { Circle, Path } from 'react-native-svg';

type IconProps = {
  color: string;
  size?: number;
};

export function IconSun({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.4" />
      <Path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconMoon({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 13.5A6.5 6.5 0 1 1 10.5 7 5.2 5.2 0 0 0 16 13.5Z"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconSliders({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 8h16M4 16h16" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Circle cx="9" cy="8" r="2" stroke={color} strokeWidth="1.4" fill="none" />
      <Circle cx="15" cy="16" r="2" stroke={color} strokeWidth="1.4" fill="none" />
    </Svg>
  );
}

export function IconInstrument({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 20c3 0 5-3 5-7V5.5a2.5 2.5 0 1 1 2 0V13c0 5-3 8-7 8Z"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <Circle cx="8" cy="18" r="1.4" stroke={color} strokeWidth="1.2" />
    </Svg>
  );
}

export function IconExpand({ color, size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 5H5v4M15 5h4v4M9 19H5v-4M15 19h4v-4"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
