import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw new Error('Erro ao salvar dados');
  }
};

export const loadData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    throw new Error('Erro ao carregar dados');
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    throw new Error('Erro ao remover dados');
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    throw new Error('Erro ao limpar cache');
  }
};

export const registerUser = async (newUser) => {
  try {
    const users = await loadData('users') || [];
    
    // Verifica se o email já está registrado
    const emailExists = users.some(user => user.email === newUser.email);
    if (emailExists) {
      throw new Error('Email já cadastrado');
    }

    // Verifica se o nome de usuário já está em uso
    const usernameExists = users.some(user => user.username === newUser.username);
    if (usernameExists) {
      throw new Error('Nome de usuário já está em uso');
    }

    // Adiciona o novo usuário à lista
    const updatedUsers = [...users, newUser];
    await saveData('users', updatedUsers);
    
    return true;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    // Carrega a lista de usuários
    const users = await loadData('users') || [];
    
    // Procura o usuário com email e senha correspondentes
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const saveToHistory = async (task, action) => {
  try {
    const history = await loadData('taskHistory') || {};
    const date = new Date().toISOString().split('T')[0];
    
    if (!history[date]) {
      history[date] = [];
    }

    const existingTaskIndex = history[date].findIndex(t => t.id === task.id);
    
    if (existingTaskIndex >= 0) {
      history[date][existingTaskIndex] = {
        ...task,
        [action]: true,
        updatedAt: new Date().toISOString()
      };
    } else {
      history[date].push({
        ...task,
        [action]: true,
        completedAt: new Date().toISOString()
      });
    }

    await saveData('taskHistory', history);
  } catch (error) {
    console.error('Erro ao salvar no histórico:', error);
  }
}; 