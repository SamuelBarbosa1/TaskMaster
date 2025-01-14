import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useConnection } from '../context/ConnectionContext';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ConnectionStatus = () => {
  const { isConnected } = useConnection();
  const { theme } = useTheme();
  const translateY = new Animated.Value(isConnected ? -50 : 0);

  React.useEffect(() => {
    Animated.spring(translateY, {
      toValue: isConnected ? -50 : 0,
      useNativeDriver: true,
    }).start();
  }, [isConnected]);

  return (
    <Animated.View
      style={[
        styles.container,
        { 
          backgroundColor: theme.danger,
          transform: [{ translateY }] 
        }
      ]}
    >
      <Icon name="cloud-off" size={20} color={theme.white} />
      <Text style={styles.text}>Modo Offline</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  text: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ConnectionStatus; 