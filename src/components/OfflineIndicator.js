import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useOffline } from '../context/OfflineContext';
import { useTheme } from '../context/ThemeContext';

const OfflineIndicator = () => {
  const { isOnline } = useOffline();
  const { theme } = useTheme();
  const translateY = new Animated.Value(isOnline ? -50 : 0);

  React.useEffect(() => {
    Animated.spring(translateY, {
      toValue: isOnline ? -50 : 0,
      useNativeDriver: true,
    }).start();
  }, [isOnline]);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.danger },
        { transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.text}>Você está offline</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    alignItems: 'center',
    zIndex: 999,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OfflineIndicator; 