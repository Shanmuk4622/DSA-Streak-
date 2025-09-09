'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAnimations } from '@/lib/useAnimations';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { themeToggleAnimation, rotateThemeToggle } = useAnimations();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    rotateThemeToggle();
  };

  return (
    <motion.button onClick={toggleTheme} animate={themeToggleAnimation} variants={{ rotate: { rotate: 360 } }} transition={{ duration: 0.3 }}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </motion.button>
  );
};