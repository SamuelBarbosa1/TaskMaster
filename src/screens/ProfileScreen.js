import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { loadData, saveData, clearAllData } from '../services/storage';
import colors from '../styles/colors';
import styles from '../styles/profileStyles';
import { ThemeSelector } from '../components/ThemeSelector';
import { useTheme } from '../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = ({ route }) => {
  const { user, onLogout } = route.params;
  const { theme } = useTheme();
  const [profileImage, setProfileImage] = useState(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    streak: 0,
  });
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadProfileData();
      calculateStats();
      return () => {};
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      calculateStats();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadProfileData = async () => {
    try {
      const profileData = await loadData(`profile_${user.email}`);
      if (profileData) {
        setProfileImage(profileData.image);
        setBio(profileData.bio || '');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
    }
  };

  const calculateStats = async () => {
    try {
      const tasks = await loadData('tasks') || [];
      const history = await loadData('taskHistory') || {};
      
      const totalTasks = tasks.length + Object.values(history)
        .flat()
        .length;

      const completedTasks = Object.values(history)
        .flat()
        .filter(task => task.completed)
        .length;
      
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let currentDate = new Date(today);

      while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const tasksForDate = history[dateStr] || [];
        const hasCompletedTasks = tasksForDate.some(task => task.completed);

        if (hasCompletedTasks) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          if (currentDate.getTime() === today.getTime() && tasks.length > 0) {
            streak++;
          }
          break;
        }
      }

      setStats({ totalTasks, completedTasks, streak });
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        saveProfileData({ image: imageUri });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const saveProfileData = async (data) => {
    try {
      const currentData = await loadData(`profile_${user.email}`) || {};
      const updatedData = { ...currentData, ...data };
      await saveData(`profile_${user.email}`, updatedData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados do perfil');
    }
  };

  const handleSaveBio = async () => {
    await saveProfileData({ bio });
    setIsEditingBio(false);
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

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: theme.border }]}>
              <Icon name="person" size={50} color={theme.textSecondary} />
            </View>
          )}
          <View style={[styles.editIconContainer, { backgroundColor: theme.primary }]}>
            <Icon name="edit" size={20} color={theme.white} />
          </View>
        </TouchableOpacity>
        <Text style={[styles.username, { color: theme.text }]}>{user.username}</Text>
        <Text style={[styles.email, { color: theme.textSecondary }]}>{user.email}</Text>
      </View>

      <View style={[styles.statsContainer, { backgroundColor: theme.card }]}>
        <View style={styles.statItem}>
          <Icon name="assignment" size={24} color={theme.primary} />
          <Text style={[styles.statNumber, { color: theme.text }]}>{stats.totalTasks}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total de Tarefas</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="check-circle" size={24} color={theme.priority.low} />
          <Text style={[styles.statNumber, { color: theme.text }]}>{stats.completedTasks}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Completadas</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="local-fire-department" size={24} color={theme.secondary} />
          <Text style={[styles.statNumber, { color: theme.text }]}>{stats.streak}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Dias Seguidos</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Sobre mim</Text>
        {isEditingBio ? (
          <View style={styles.bioEditContainer}>
            <TextInput
              style={[styles.bioInput, { 
                backgroundColor: theme.background,
                color: theme.text,
                borderColor: theme.border,
                borderWidth: 1,
              }]}
              multiline
              value={bio}
              onChangeText={setBio}
              placeholder="Escreva algo sobre você..."
              placeholderTextColor={theme.textSecondary}
            />
            <TouchableOpacity 
              style={[styles.bioSaveButton, { backgroundColor: theme.primary }]}
              onPress={handleSaveBio}
            >
              <Text style={[styles.bioSaveButtonText, { color: theme.white }]}>Salvar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsEditingBio(true)}>
            <Text style={[styles.bioText, { color: theme.textSecondary }]}>
              {bio || 'Toque para adicionar uma biografia...'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <ThemeSelector />
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.textSecondary }]}
          onPress={handleClearCache}
        >
          <Icon name="delete-sweep" size={24} color={theme.white} />
          <Text style={[styles.actionButtonText, { color: theme.white }]}>
            Limpar Cache
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.danger }]}
          onPress={handleLogout}
        >
          <Icon name="exit-to-app" size={24} color={theme.white} />
          <Text style={[styles.actionButtonText, { color: theme.white }]}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen; 