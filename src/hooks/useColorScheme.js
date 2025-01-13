import { useState, useEffect } from 'react';
import { Appearance, useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useColorScheme = () => {
  const deviceColorScheme = useNativeColorScheme();
  const [colorScheme, setColorScheme] = useState(deviceColorScheme);
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      if (isSystemTheme) {
        setColorScheme(newColorScheme);
      }
    });

    return () => subscription.remove();
  }, [isSystemTheme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_preference');
      const useSystem = await AsyncStorage.getItem('use_system_theme');
      
      if (useSystem === 'false') {
        setIsSystemTheme(false);
        if (savedTheme) {
          setColorScheme(savedTheme);
        }
      } else {
        setIsSystemTheme(true);
        setColorScheme(deviceColorScheme);
      }
    } catch (error) {
      console.error('Erro ao carregar preferência de tema:', error);
    }
  };

  const setTheme = async (theme, useSystem = false) => {
    try {
      if (useSystem) {
        await AsyncStorage.setItem('use_system_theme', 'true');
        setIsSystemTheme(true);
        setColorScheme(deviceColorScheme);
      } else {
        await AsyncStorage.setItem('use_system_theme', 'false');
        await AsyncStorage.setItem('theme_preference', theme);
        setIsSystemTheme(false);
        setColorScheme(theme);
      }
    } catch (error) {
      console.error('Erro ao salvar preferência de tema:', error);
    }
  };

  return {
    colorScheme,
    isSystemTheme,
    setTheme,
  };
}; 