import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Switch } from 'react-native';
import { registerUser, loadData, saveData } from '../services/storage';
import styles from '../styles/loginStyles';
import { useTheme } from '../context/ThemeContext';

const RegisterScreen = ({ navigation, onRegister }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);

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

      // Salva as preferências do usuário
      if (rememberMe) {
        await saveData('rememberedUser', { email, password });
      }

      if (autoLogin) {
        await saveData('autoLogin', true);
      }

      await saveData('currentUser', newUser);
      onRegister(newUser);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar usuário');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.toggleText}>Já tenho conta</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen; 