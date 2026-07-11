'use client';

import { useEffect, useState } from 'react';
import { CgMoon, CgSun } from 'react-icons/cg';
import { VscColorMode } from 'react-icons/vsc';
import { useTheme } from '@/contexts/ThemeContext';

function getButtonTitle(theme: string) {
  return theme === 'dark'
    ? 'Dark color scheme'
    : theme === 'light'
      ? 'Light color scheme'
      : 'Device color scheme';
}

export default function ThemeSwitcherButton() {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const buttonTitle = isLoading ? 'none' : getButtonTitle(theme);

  // NOTE: Next Client components are still pre-rendered on the server
  // so that static html is generated for them and send out to the client.
  // This can cause Hydration issues. That's why you need to have a common "loading"
  // state for client and server and then use useEffect on the client
  useEffect(() => setIsLoading(false), []);

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-xl dark:bg-gray-800"
      title={buttonTitle}
      aria-label={buttonTitle}
    >
      {isLoading ? null : theme === 'dark' ? (
        <CgMoon />
      ) : theme === 'light' ? (
        <CgSun />
      ) : (
        <VscColorMode />
      )}
    </button>
  );
}
