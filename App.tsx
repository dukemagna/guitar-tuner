import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TunerScreen } from './src/screens/TunerScreen';
import { ThemeProvider } from './src/theme/ThemeContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TunerScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
