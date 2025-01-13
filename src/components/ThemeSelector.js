import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useColorScheme } from '../hooks/useColorScheme';
import { useTheme } from '../context/ThemeContext';

export const ThemeSelector = () => {
  const { colorScheme, isSystemTheme, setTheme } = useColorScheme();
  const { theme, updateTheme } = useTheme();

  const handleThemeChange = async (newTheme, useSystem = false) => {
    await setTheme(newTheme, useSystem);
    updateTheme(newTheme);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.text }]}>Tema do Aplicativo</Text>
      
      <TouchableOpacity
        style={[
          styles.option,
          isSystemTheme && styles.selectedOption
        ]}
        onPress={() => handleThemeChange(null, true)}
      >
        <Icon name="settings-brightness" size={24} color={theme.text} />
        <Text style={[styles.optionText, { color: theme.text }]}>
          Sistema
        </Text>
        {isSystemTheme && <Icon name="check" size={24} color={theme.primary} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          !isSystemTheme && colorScheme === 'light' && styles.selectedOption
        ]}
        onPress={() => handleThemeChange('light')}
      >
        <Icon name="light-mode" size={24} color={theme.text} />
        <Text style={[styles.optionText, { color: theme.text }]}>
          Claro
        </Text>
        {!isSystemTheme && colorScheme === 'light' && (
          <Icon name="check" size={24} color={theme.primary} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          !isSystemTheme && colorScheme === 'dark' && styles.selectedOption
        ]}
        onPress={() => handleThemeChange('dark')}
      >
        <Icon name="dark-mode" size={24} color={theme.text} />
        <Text style={[styles.optionText, { color: theme.text }]}>
          Escuro
        </Text>
        {!isSystemTheme && colorScheme === 'dark' && (
          <Icon name="check" size={24} color={theme.primary} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
}); 