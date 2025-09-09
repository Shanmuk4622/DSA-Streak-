'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useAnimations } from '@/lib/useAnimations';

const desktopVariants = {
  initial: { width: 72 },
  collapsed: { width: 20 },
};

const mobileVariants = {
  initial: { x: '-100%' },
  open: { x: 0 },
};

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { sidebarAnimation, mobileSidebarAnimation, toggleSidebar, toggleMobileSidebar } = useAnimations();

  const handleDesktopToggle = () => {
    setIsCollapsed(!isCollapsed);
    toggleSidebar(isCollapsed);
  };

  const handleMobileToggle = () => {
    setIsOpen(!isOpen);
    toggleMobileSidebar(isOpen);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden md:flex flex-col justify-between h-full bg-light-background dark:bg-dark-background border-r border-gray-200 dark:border-gray-700"
        animate={sidebarAnimation}
        initial="initial"
        variants={desktopVariants}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4">
          <ThemeToggle />
        </div>
        <button onClick={handleDesktopToggle} className="p-4">
          Toggle
        </button>
      </motion.div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button onClick={handleMobileToggle} className="p-4">
          Menu
        </button>
        <motion.div
          className="fixed inset-y-0 left-0 w-64 bg-light-background dark:bg-dark-background z-50"
          animate={mobileSidebarAnimation}
          initial="initial"
          variants={mobileVariants}
          transition={{ duration: 0.25 }}
        >
          <div className="p-4">
            <ThemeToggle />
          </div>
        </motion.div>
      </div>
    </>
  );
};