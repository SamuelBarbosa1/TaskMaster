const light = {
  primary: '#007AFF',
  secondary: '#FF9500',
  danger: '#FF3B30',
  background: '#F2F2F7',
  card: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  textLight: '#999999',
  border: '#E0E0E0',
  white: '#FFFFFF',
  priority: {
    low: '#4CD964',
    medium: '#FFCC00',
    high: '#FF3B30'
  },
  shadow: {
    color: '#000000',
    opacity: 0.1
  },
  overlay: 'rgba(0, 0, 0, 0.5)'
};

const dark = {
  primary: '#0A84FF',
  secondary: '#FF9F0A',
  danger: '#FF453A',
  background: '#121212',
  card: '#242424',
  text: '#FFFFFF',
  textSecondary: '#ADADAD',
  textLight: '#8E8E93',
  border: '#383838',
  white: '#FFFFFF',
  priority: {
    low: '#32D74B',
    medium: '#FFD60A',
    high: '#FF453A'
  },
  shadow: {
    color: '#000000',
    opacity: 0.2
  },
  overlay: 'rgba(0, 0, 0, 0.6)'
};

export default {
  light,
  dark,
  // Cores que não mudam com o tema
  static: {
    transparent: 'transparent',
  },
  // Cores padrão para compatibilidade
  primary: light.primary,
  secondary: light.secondary,
  danger: light.danger,
  background: light.background,
  white: light.white,
  text: {
    primary: light.text,
    secondary: light.textSecondary,
    light: light.textLight,
  },
  priority: light.priority
}; 