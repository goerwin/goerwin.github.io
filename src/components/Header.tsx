import Link from 'next/link';
import ThemeSwitcherButton from '@/components/ThemeSwitcherButton';
import { ThemeContextProvider } from '@/contexts/ThemeContext';

const menuItems = [
  { title: 'Home', href: '/' },
  { title: 'About', id: 'about', href: '/' },
  { title: 'Projects', id: 'projects', href: '/' },
  { title: 'Skills', id: 'skills', href: '/' },
  { title: 'Experience', id: 'experience', href: '/' },
];

export default function Header() {
  return (
    <ul className="fixed right-0 left-0 z-50 flex flex-wrap justify-center gap-2 bg-white/80 p-2 text-sm shadow-black/10 shadow-lg backdrop-blur-md md:top-6 md:right-auto md:left-1/2 md:-translate-x-1/2 md:flex-nowrap md:rounded-full dark:bg-black/80">
      {menuItems.map(({ title, id, href }) => (
        <li key={title}>
          <Link
            href={`${href}${id ? `#${id}` : ''}`}
            className="block rounded-full px-4 py-2 text-gray-600 hover:text-gray-950 dark:text-white/60 dark:hover:text-white"
          >
            {title}
          </Link>
        </li>
      ))}
      <li key="theme-switcher-button" className="self-center leading-none">
        <ThemeContextProvider>
          <ThemeSwitcherButton />
        </ThemeContextProvider>
      </li>
    </ul>
  );
}
