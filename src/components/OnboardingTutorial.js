import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

// Criar um FlatList animado
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const tutorialSteps = [
  {
    id: '1',
    title: 'Bem-vindo ao TaskMaster!',
    description: 'Organize suas tarefas de forma simples e eficiente.',
    icon: 'check-circle',
  },
  {
    id: '2',
    title: 'Adicione Tarefas',
    description: 'Crie tarefas com diferentes prioridades e categorias.',
    icon: 'add-task',
  },
  {
    id: '3',
    title: 'Acompanhe seu Progresso',
    description: 'Visualize suas conquistas e mantenha seu streak diário.',
    icon: 'trending-up',
  },
  {
    id: '4',
    title: 'Personalize',
    description: 'Escolha entre tema claro ou escuro e organize do seu jeito.',
    icon: 'palette',
  },
];

const OnboardingTutorial = ({ onComplete }) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animação inicial mais suave
    Animated.spring(fadeIn, {
      toValue: 1,
      useNativeDriver: true,
      damping: 20,
      stiffness: 90,
    }).start();
  }, []);

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [30, 0, 30],
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
    });

    return (
      <View style={styles.slide}>
        <Animated.View
          style={[
            styles.slideContent,
            {
              transform: [{ scale }, { translateY }],
              opacity,
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: theme.card }]}>
            <Icon name={item.icon} size={80} color={theme.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {item.description}
            </Text>
          </View>
        </Animated.View>
      </View>
    );
  };

  const finishTutorial = () => {
    Animated.timing(fadeOut, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onComplete();
    });
  };

  const handleNext = () => {
    if (currentIndex < tutorialSteps.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      finishTutorial();
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { opacity: Animated.multiply(fadeIn, fadeOut) }
      ]}
    >
      <View style={styles.content}>
        <AnimatedFlatList
          ref={flatListRef}
          data={tutorialSteps}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setCurrentIndex(newIndex);
          }}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {tutorialSteps.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: theme.primary,
                  opacity: scrollX.interpolate({
                    inputRange: [(index - 1) * width, index * width, (index + 1) * width],
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                  }),
                  transform: [{
                    scale: scrollX.interpolate({
                      inputRange: [(index - 1) * width, index * width, (index + 1) * width],
                      outputRange: [1, 1.4, 1],
                      extrapolate: 'clamp',
                    }),
                  }],
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentIndex === tutorialSteps.length - 1 ? 'Começar' : 'Próximo'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  slide: {
    width,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    marginBottom: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingBottom: 50,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    marginHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingTutorial; 