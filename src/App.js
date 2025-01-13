import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Alert } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TaskScreen from './screens/TaskScreen';
import CalendarScreen from './screens/CalendarScreen';
import { loadData } from './services/storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './screens/ProfileScreen';
import colors from './styles/colors';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useColorScheme } from './hooks/useColorScheme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = ({ user, onLogout }) => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={TaskScreen}
        initialParams={{ user }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendário"
        component={CalendarScreen}
        initialParams={{ user }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-today" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        initialParams={{ user, onLogout }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await loadData('currentUser');
      if (savedUser) {
        setUser(savedUser);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar usuário');
    }
  };

  return (
    <ThemeProvider key={colorScheme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <>
              <Stack.Screen name="Login">
                {props => <LoginScreen {...props} onLogin={setUser} />}
              </Stack.Screen>
              <Stack.Screen name="Register">
                {props => <RegisterScreen {...props} onRegister={setUser} />}
              </Stack.Screen>
            </>
          ) : (
            <Stack.Screen name="MainApp">
              {props => <TabNavigator {...props} user={user} onLogout={() => setUser(null)} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App; 