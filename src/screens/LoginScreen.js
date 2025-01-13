import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Switch,
} from 'react-native';
import { loadData, saveData } from '../services/storage';
import { useTheme } from '../context/ThemeContext';

const LoginScreen = ({ navigation, onLogin }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);

  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    try {
      const savedAutoLogin = await loadData('autoLogin');
      const savedUser = await loadData('currentUser');
      
      if (savedAutoLogin && savedUser) {
        onLogin(savedUser);
      } else {
        // Carrega dados salvos do "Lembrar-me"
        const rememberedUser = await loadData('rememberedUser');
        if (rememberedUser) {
          setEmail(rememberedUser.email);
          setPassword(rememberedUser.password);
          setRememberMe(true);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar auto-login:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const users = await loadData('users') || [];
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Salva as preferências do usuário
        if (rememberMe) {
          await saveData('rememberedUser', { email, password });
        } else {
          await saveData('rememberedUser', null);
        }

        if (autoLogin) {
          await saveData('autoLogin', true);
        } else {
          await saveData('autoLogin', false);
        }

        await saveData('currentUser', user);
        onLogin(user);
      } else {
        Alert.alert('Erro', 'Email ou senha incorretos');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao fazer login');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Login</Text>
      
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
        autoCapitalize="none"
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
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.registerLink}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={[styles.registerText, { color: theme.primary }]}>
          Não tem uma conta? Cadastre-se
        </Text>
      </TouchableOpacity>
    </View>
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
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
  },
});

export default LoginScreen; 