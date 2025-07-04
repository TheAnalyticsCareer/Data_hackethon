import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Default to light mode unless user explicitly set dark
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('datasprint_theme');
    if (stored) return stored === 'dark';
    return false; // default to light
  });

  // Removed empty useEffect (was unnecessary)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('datasprint_theme', 'dark');
      // Set font color for dark mode
      document.documentElement.style.setProperty('--font-color', '#fff');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('datasprint_theme', 'light');
      // Set font color for light mode
      document.documentElement.style.setProperty('--font-color', '#1e293b');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;