import { useAnimation } from 'framer-motion';

export const useAnimations = () => {
  const sidebarAnimation = useAnimation();
  const mobileSidebarAnimation = useAnimation();
  const themeToggleAnimation = useAnimation();

  const toggleSidebar = (isCollapsed: boolean) => {
    sidebarAnimation.start(isCollapsed ? 'collapsed' : 'initial');
  };

  const toggleMobileSidebar = (isOpen: boolean) => {
    mobileSidebarAnimation.start(isOpen ? 'open' : 'initial');
  };

  const rotateThemeToggle = () => {
    themeToggleAnimation.start('rotate');
  };

  return {
    sidebarAnimation,
    mobileSidebarAnimation,
    themeToggleAnimation,
    toggleSidebar,
    toggleMobileSidebar,
    rotateThemeToggle,
  };
};