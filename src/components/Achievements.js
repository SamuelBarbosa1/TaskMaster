import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const achievements = [
  {
    id: 'streak_3',
    title: 'Consistente',
    description: '3 dias seguidos',
    icon: 'local-fire-department',
    requirement: (stats) => stats.streak >= 3,
  },
  {
    id: 'streak_7',
    title: 'Dedicado',
    description: '7 dias seguidos',
    icon: 'whatshot',
    requirement: (stats) => stats.streak >= 7,
  },
  {
    id: 'tasks_10',
    title: 'Produtivo',
    description: '10 tarefas',
    icon: 'star',
    requirement: (stats) => stats.completedTasks >= 10,
  },
  {
    id: 'tasks_50',
    title: 'Super',
    description: '50 tarefas',
    icon: 'stars',
    requirement: (stats) => stats.completedTasks >= 50,
  },
  {
    id: 'categories_all',
    title: 'Versátil',
    description: 'Todas categorias',
    icon: 'category',
    requirement: (stats) => stats.categoriesCompleted >= 6,
  },
];

const AchievementItem = ({ achievement, isUnlocked, theme }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(isUnlocked ? 1 : 0.6)).current;

  React.useEffect(() => {
    if (isUnlocked) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          useNativeDriver: true,
          friction: 3,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 3,
        }),
      ]).start();

      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isUnlocked]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        if (isUnlocked) {
          Animated.sequence([
            Animated.spring(scaleAnim, {
              toValue: 0.95,
              useNativeDriver: true,
              friction: 3,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              useNativeDriver: true,
              friction: 3,
            }),
          ]).start();
        }
      }}
      style={styles.achievementWrapper}
    >
      <Animated.View
        style={[
          styles.achievement,
          {
            backgroundColor: isUnlocked ? theme.primary : theme.background,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Icon
          name={achievement.icon}
          size={32}
          color={isUnlocked ? theme.white : theme.textSecondary}
          style={styles.achievementIcon}
        />
        <Text
          style={[
            styles.achievementTitle,
            { color: isUnlocked ? theme.white : theme.text },
          ]}
        >
          {achievement.title}
        </Text>
        <Text
          style={[
            styles.achievementDescription,
            { color: isUnlocked ? theme.white : theme.textSecondary },
          ]}
        >
          {achievement.description}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const Achievements = ({ stats }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Conquistas</Text>
      <View style={styles.achievementsContainer}>
        {achievements.map((achievement) => (
          <AchievementItem
            key={achievement.id}
            achievement={achievement}
            isUnlocked={achievement.requirement(stats)}
            theme={theme}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  achievementWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  achievement: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  achievementIcon: {
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Achievements; 