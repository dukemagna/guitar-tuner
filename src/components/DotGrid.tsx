import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

import { useTheme } from '../theme/ThemeContext';

function DotGridComponent() {
  const { theme } = useTheme();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <Circle cx="1.2" cy="1.2" r="0.75" fill={theme.grid} />
          </Pattern>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
      </Svg>
    </View>
  );
}

export const DotGrid = memo(DotGridComponent);
