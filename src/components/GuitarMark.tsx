import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '../theme';

export function GuitarMark() {
  return (
    <Svg width="28" height="28" viewBox="0 0 64 64">
      <Path
        d="M28 8c6 0 8 4 8 8v18c10 4 14 12 10 18-4 7-16 8-22 2-6-5-5-16 4-20V16c0-4 2-8 8-8z"
        fill={colors.gold}
      />
      <Circle cx="30" cy="46" r="4.5" fill="#1A120C" />
      <Path d="M30 8v10" stroke="#1A120C" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}
