import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { loadData } from '../services/storage';
import Achievements from '../components/Achievements';

const StatsScreen = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      const tasks = await loadData('tasks') || [];
      const history = await loadData('taskHistory') || {};
      
      // Calcular estatísticas semanais
      const weekLabels = [];
      const weeklyCompleted = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        weekLabels.push(date.toLocaleDateString('pt-BR', { weekday: 'short' }));
        
        const completedToday = (history[dateStr] || [])
          .filter(task => task.completed)
          .length;
        weeklyCompleted.push(completedToday);
      }

      // Calcular estatísticas por prioridade
      const priorityStats = {
        baixa: 0,
        média: 0,
        alta: 0,
      };

      Object.values(history).flat().forEach(task => {
        if (task.completed) {
          priorityStats[task.priority]++;
        }
      });

      // Calcular outras estatísticas
      const categoriesCompleted = new Set(
        Object.values(history)
          .flat()
          .filter(task => task.completed)
          .map(task => task.category)
      ).size;

      setStats({
        weekLabels,
        weeklyCompleted,
        priorityStats,
        completedTasks: Object.values(history)
          .flat()
          .filter(task => task.completed)
          .length,
        streak: parseInt(await loadData('streak') || '0'),
        categoriesCompleted,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  if (!stats) return null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={theme.primary}
        />
      }
    >
      <Achievements stats={stats} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default StatsScreen; 