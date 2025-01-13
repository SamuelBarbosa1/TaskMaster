import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from '../hooks/useColorScheme';
import colors from '../styles/colors';

const ThemeContext = createContext({
  theme: colors.light,
  updateTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const { colorScheme } = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState(colors[colorScheme] || colors.light);

  useEffect(() => {
    setCurrentTheme(colors[colorScheme] || colors.light);
  }, [colorScheme]);

  const updateTheme = (newColorScheme) => {
    setCurrentTheme(colors[newColorScheme] || colors.light);
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return { theme: colors.light, updateTheme: () => {} };
  }
  return context;
}; 