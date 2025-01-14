import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TaskItem from './TaskItem';
import { useTheme } from '../context/ThemeContext';

const SwipeableTaskItem = ({ task, onComplete, onDelete, onEdit }) => {
  const { theme } = useTheme();

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Swipeable
      friction={2}
      rightThreshold={40}
      renderRightActions={(progress, dragX) => {
        const scale = dragX.interpolate({
          inputRange: [-100, 0],
          outputRange: [1, 0],
          extrapolate: 'clamp',
        });

        return (
          <>
            <RectButton
              style={[styles.rightAction, { backgroundColor: theme.priority.low }]}
              onPress={handleComplete}
            >
              <Animated.View
                style={[styles.actionIcon, { transform: [{ scale }] }]}
              >
                <Icon name="check" size={24} color="white" />
              </Animated.View>
            </RectButton>
            <RectButton
              style={[styles.rightAction, { backgroundColor: theme.danger }]}
              onPress={onDelete}
            >
              <Animated.View
                style={[styles.actionIcon, { transform: [{ scale }] }]}
              >
                <Icon name="delete" size={24} color="white" />
              </Animated.View>
            </RectButton>
          </>
        );
      }}
    >
      <TaskItem 
        task={task} 
        onEdit={onEdit}
        onToggleComplete={handleComplete}
      />
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  rightAction: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: '100%',
  },
  actionIcon: {
    width: 30,
    marginHorizontal: 10,
    alignItems: 'center',
  },
});

export default SwipeableTaskItem; 