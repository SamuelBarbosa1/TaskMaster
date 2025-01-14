import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Switch, StyleSheet, Animated } from 'react-native';
import { registerUser, loadData, saveData } from '../services/storage';
import { useTheme } from '../context/ThemeContext';
import OnboardingTutorial from '../components/OnboardingTutorial';

const RegisterScreen = ({ navigation, onRegister }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [newUserData, setNewUserData] = useState(null);
  
  // Adicionar animações
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const tutorialFade = useRef(new Animated.Value(0)).current;

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !username.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      const users = await loadData('users') || [];
      
      if (users.some(u => u.email === email)) {
        Alert.alert('Erro', 'Este email já está cadastrado');
        return;
      }

      const newUser = { username, email, password };
      await saveData('users', [...users, newUser]);

      if (rememberMe) {
        await saveData('rememberedUser', { email, password });
      }

      if (autoLogin) {
        await saveData('autoLogin', true);
      }

      await saveData('currentUser', newUser);
      setNewUserData(newUser);

      // Animar a transição
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(tutorialFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowTutorial(true);
      });

    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar usuário');
    }
  };

  if (showTutorial) {
    return (
      <Animated.View style={[styles.container, { opacity: tutorialFade }]}>
        <OnboardingTutorial
          onComplete={async () => {
            await saveData('tutorialCompleted', true);
            onRegister(newUserData);
          }}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.background,
          opacity: fadeAnim 
        }
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Cadastro</Text>
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: theme.card,
          color: theme.text,
          borderColor: theme.border 
        }]}
        placeholder="Email"
        placeholderTextColor={theme.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: theme.card,
          color: theme.text,
          borderColor: theme.border 
        }]}
        placeholder="Nome de usuário"
        placeholderTextColor={theme.textSecondary}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="words"
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: theme.card,
          color: theme.text,
          borderColor: theme.border 
        }]}
        placeholder="Senha"
        placeholderTextColor={theme.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.optionsContainer}>
        <View style={styles.optionRow}>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.card}
          />
          <Text style={[styles.optionText, { color: theme.text }]}>Lembrar-me</Text>
        </View>

        <View style={styles.optionRow}>
          <Switch
            value={autoLogin}
            onValueChange={setAutoLogin}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.card}
          />
          <Text style={[styles.optionText, { color: theme.text }]}>Login automático</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleRegister}
      >
        <Text style={[styles.buttonText, { color: theme.white }]}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.loginLink}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={[styles.loginText, { color: theme.primary }]}>
          Já tenho conta
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    fontSize: 16,
  },
  optionsContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
  },
});

export default RegisterScreen; 