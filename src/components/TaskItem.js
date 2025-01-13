import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/taskItemStyles';

const TaskItem = ({ task, onToggleComplete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const { theme } = useTheme();

  const handleSaveEdit = () => {
    onEdit(task.id, editedText);
    setIsEditing(false);
  };

  return (
    <View style={[
      styles.taskItem,
      { backgroundColor: theme.card },
      styles[`${task.priority}Priority`]
    ]}>
      <TouchableOpacity 
        style={[styles.checkbox, { borderColor: theme.primary }]}
        onPress={() => onToggleComplete(task.id)}
      >
        {task.completed && (
          <View style={[styles.checked, { backgroundColor: theme.primary }]} />
        )}
      </TouchableOpacity>

      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={[
              styles.editInput,
              {
                backgroundColor: theme.background,
                color: theme.text.primary
              }
            ]}
            value={editedText}
            onChangeText={setEditedText}
            autoFocus
          />
          <TouchableOpacity onPress={handleSaveEdit}>
            <Text style={[styles.saveButton, { color: theme.primary }]}>
              Salvar
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.taskContent}>
          <Text style={[
            styles.taskText,
            { color: theme.text.primary },
            task.completed && { 
              textDecorationLine: 'line-through',
              color: theme.text.light 
            }
          ]}>
            {task.text}
          </Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={[styles.editButton, { color: theme.primary }]}>
                Editar
              </Text>
            </TouchableOpacity>
            <Text style={[styles.priorityLabel, { color: theme.text.secondary }]}>
              {task.priority}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default TaskItem; 