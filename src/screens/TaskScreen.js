import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import { loadData, saveData, clearAllData } from '../services/storage';
import TaskItem from '../components/TaskItem';
import styles from '../styles/taskScreenStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const saveToHistory = async (task, action) => {
  try {
    const history = await loadData('taskHistory') || {};
    const date = new Date(task.createdAt).toISOString().split('T')[0];
    
    if (!history[date]) {
      history[date] = [];
    }

    // Verifica se a tarefa já existe no histórico
    const existingTaskIndex = history[date].findIndex(t => t.id === task.id);
    
    if (existingTaskIndex >= 0) {
      // Atualiza a tarefa existente
      history[date][existingTaskIndex] = {
        ...task,
        [action]: true,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Adiciona nova tarefa ao histórico
      history[date].push({
        ...task,
        [action]: true,
        updatedAt: new Date().toISOString()
      });
    }

    await saveData('taskHistory', history);
  } catch (error) {
    console.error('Erro ao salvar no histórico:', error);
  }
};

const TaskScreen = ({ route }) => {
  const { user } = route.params;
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('média');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await loadData('tasks');
      if (savedTasks) {
        setTasks(savedTasks);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar tarefas');
    }
  };

  const addTask = async () => {
    if (newTask.trim() === '') return;

    const newTaskItem = {
      id: Math.random().toString(),
      text: newTask,
      priority: selectedPriority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTaskItem];
    try {
      await saveData('tasks', updatedTasks);
      setTasks(updatedTasks);
      setNewTask('');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao adicionar tarefa');
    }
  };

  const deleteAllTasks = async () => {
    try {
      tasks.forEach(task => saveToHistory(task, 'deleted'));
      await saveData('tasks', []);
      setTasks([]);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao apagar tarefas');
    }
  };

  const deleteTasksByPriority = async (priority) => {
    try {
      const tasksToDelete = tasks.filter(task => task.priority === priority);
      tasksToDelete.forEach(task => saveToHistory(task, 'deleted'));
      
      const filteredTasks = tasks.filter(task => task.priority !== priority);
      await saveData('tasks', filteredTasks);
      setTasks(filteredTasks);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao apagar tarefas');
    }
  };

  const toggleTaskComplete = async (taskId) => {
    try {
      const taskToComplete = tasks.find(task => task.id === taskId);
      if (taskToComplete) {
        // Salva no histórico
        await saveToHistory({ ...taskToComplete, completed: true }, 'completed');
        
        // Remove a tarefa da lista
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        await saveData('tasks', updatedTasks);
        setTasks(updatedTasks);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao completar tarefa');
    }
  };

  const editTask = async (taskId, newText) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === taskId
          ? { ...task, text: newText }
          : task
      );
      await saveData('tasks', updatedTasks);
      setTasks(updatedTasks);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao editar tarefa');
    }
  };

  const handleLogout = async () => {
    try {
      await saveData('currentUser', null);
      onLogout();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao fazer logout');
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Limpar Cache',
      'Isso irá apagar todos os dados do aplicativo. Você terá que fazer login novamente. Deseja continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              onLogout();
            } catch (error) {
              Alert.alert('Erro', 'Erro ao limpar cache');
            }
          }
        }
      ]
    );
  };

  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const hideDeleteModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsDeleteModalVisible(false));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.welcomeContainer, { backgroundColor: theme.card }]}>
        <Text style={[styles.welcomeText, { color: theme.text }]}>
          Olá, {user.username}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.card,
            borderColor: theme.border,
            color: theme.text 
          }]}
          placeholder="Nova tarefa"
          placeholderTextColor={theme.textSecondary}
          value={newTask}
          onChangeText={setNewTask}
        />
        <View style={styles.priorityContainer}>
          {['baixa', 'média', 'alta'].map((priority) => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.priorityButton,
                { backgroundColor: theme.card },
                selectedPriority === priority && [
                  styles.selectedPriority,
                  { backgroundColor: theme.primary }
                ],
              ]}
              onPress={() => setSelectedPriority(priority)}
            >
              <Text style={[
                styles.priorityText,
                { color: selectedPriority === priority ? theme.card : theme.text }
              ]}>
                {priority}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={addTask}
        >
          <Text style={styles.buttonText}>Adicionar Tarefa</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem 
            task={item}
            onToggleComplete={toggleTaskComplete}
            onEdit={editTask}
          />
        )}
      />

      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={showDeleteModal}
      >
        <Icon name="delete" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="none"
        onRequestClose={hideDeleteModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={hideDeleteModal}
        >
          <Animated.View 
            style={[
              styles.deleteModal,
              { backgroundColor: theme.card },
              {
                transform: [
                  {
                    scale: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                opacity: modalAnimation,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Opções de Exclusão
            </Text>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.baixaButton]}
              onPress={() => {
                deleteTasksByPriority('baixa');
                hideDeleteModal();
              }}
            >
              <Icon name="delete" size={24} color="white" />
              <Text style={styles.modalButtonText}>Excluir Prioridade Baixa</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalButton, styles.médiaButton]}
              onPress={() => {
                deleteTasksByPriority('média');
                hideDeleteModal();
              }}
            >
              <Icon name="delete" size={24} color="white" />
              <Text style={styles.modalButtonText}>Excluir Prioridade Média</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalButton, styles.altaButton]}
              onPress={() => {
                deleteTasksByPriority('alta');
                hideDeleteModal();
              }}
            >
              <Icon name="delete" size={24} color="white" />
              <Text style={styles.modalButtonText}>Excluir Prioridade Alta</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: theme.danger }]}
              onPress={() => {
                deleteAllTasks();
                hideDeleteModal();
              }}
            >
              <Icon name="delete-sweep" size={24} color="white" />
              <Text style={styles.modalButtonText}>Excluir Todas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={hideDeleteModal}
            >
              <Text style={[styles.cancelButtonText, { color: theme.primary }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default TaskScreen; 