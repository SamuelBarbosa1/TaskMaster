import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { loadData } from '../services/storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import colors from '../styles/colors';
import { useFocusEffect } from '@react-navigation/native';

const CalendarScreen = () => {
  const { theme } = useTheme();
  const [taskHistory, setTaskHistory] = useState({});

  // Carrega o histórico quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      loadTaskHistory();
      return () => {};
    }, [])
  );

  // Atualiza o histórico periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      loadTaskHistory();
    }, 1000); // Atualiza a cada segundo

    return () => clearInterval(interval);
  }, []);

  const loadTaskHistory = async () => {
    try {
      const history = await loadData('taskHistory') || {};
      setTaskHistory(history);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const getStatusIcon = (task) => {
    if (task.completed) {
      return <Icon name="check-circle" size={24} color={theme.priority.low} />;
    }
    if (task.deleted) {
      return <Icon name="delete" size={24} color={theme.danger} />;
    }
    return null;
  };

  const getTaskTime = (task) => {
    const taskDate = new Date(task.updatedAt || task.createdAt);
    return taskDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formattedData = Object.entries(taskHistory)
    .map(([date, tasks]) => ({
      date,
      tasks: tasks.sort((a, b) => {
        const dateA = new Date(b.updatedAt || b.createdAt);
        const dateB = new Date(a.updatedAt || a.createdAt);
        return dateA - dateB;
      }),
      id: date,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.headerContainer, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          Histórico de Tarefas
        </Text>
      </View>
      {formattedData.length > 0 ? (
        <FlatList
          data={formattedData}
          renderItem={({ item }) => (
            <View style={styles.dateGroup}>
              <Text style={[styles.dateHeader, { 
                color: theme.text,
                backgroundColor: theme.card 
              }]}>
                {formatDate(item.date)}
              </Text>
              {item.tasks.map(task => (
                <View 
                  key={task.id} 
                  style={[
                    styles.taskItem,
                    { backgroundColor: theme.card },
                    styles[`${task.priority}Priority`],
                    task.completed && styles.completedTask
                  ]}
                >
                  <View style={styles.taskContent}>
                    <Text style={[
                      styles.taskText,
                      { color: theme.text },
                      task.completed && { color: theme.textSecondary }
                    ]}>
                      {task.text}
                    </Text>
                    <View style={styles.taskInfo}>
                      {getStatusIcon(task)}
                      <Text style={[styles.taskTime, { color: theme.textSecondary }]}>
                        {getTaskTime(task)}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.priorityLabel, { color: theme.textSecondary }]}>
                    {task.priority}
                  </Text>
                </View>
              ))}
            </View>
          )}
          keyExtractor={item => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="event-busy" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Nenhuma tarefa no histórico
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    padding: 15,
    borderRadius: 12,
    marginTop: 50,
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  taskItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 1,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'column',
  },
  taskText: {
    fontSize: 16,
    marginBottom: 5,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTime: {
    fontSize: 12,
    marginLeft: 5,
  },
  priorityLabel: {
    fontStyle: 'italic',
  },
  baixaPriority: {
    borderLeftWidth: 5,
    borderLeftColor: colors.priority.low,
  },
  médiaPriority: {
    borderLeftWidth: 5,
    borderLeftColor: colors.priority.medium,
  },
  altaPriority: {
    borderLeftWidth: 5,
    borderLeftColor: colors.priority.high,
  },
  completedTask: {
    opacity: 0.8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default CalendarScreen; 