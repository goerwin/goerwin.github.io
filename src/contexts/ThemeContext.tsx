'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';
import { tryUnknownFn } from '@/utils/general';

type Theme = 'dark' | 'light' | 'device';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
} | null>(null);

export interface Props {
  children: ReactNode;
}

export function ThemeContextProvider(props: Props) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme());

  function getInitialTheme(): Theme {
    const theme = tryUnknownFn(global, 'globalGetInitialTheme') || 'device';

    if (theme === 'dark') tryUnknownFn(global, 'globalSetDarkTheme');
    else if (theme === 'light') tryUnknownFn(global, 'globalSetLightTheme');
    else tryUnknownFn(global, 'globalSetDeviceTheme');

    return theme;
  }

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('device');
      tryUnknownFn(global, 'globalSetLSDeviceTheme');
    } else if (theme === 'device') {
      setTheme('light');
      tryUnknownFn(global, 'globalSetLSLightTheme');
    } else {
      setTheme('dark');
      tryUnknownFn(global, 'globalSetLSDarkTheme');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('This hook should be used inside a ThemeContext.Provider');
  }

  return context;
}
