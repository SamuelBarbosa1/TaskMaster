import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const categories = [
  { id: 'work', name: 'Trabalho', icon: 'work' },
  { id: 'personal', name: 'Pessoal', icon: 'person' },
  { id: 'study', name: 'Estudo', icon: 'school' },
  { id: 'shopping', name: 'Compras', icon: 'shopping-cart' },
  { id: 'health', name: 'Saúde', icon: 'favorite' },
  { id: 'other', name: 'Outros', icon: 'more-horiz' },
];

const CategoryPicker = ({ selectedCategory, onSelectCategory }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Categoria</Text>
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              { backgroundColor: theme.card },
              selectedCategory === category.id && {
                backgroundColor: theme.primary,
              },
            ]}
            onPress={() => onSelectCategory(category.id)}
          >
            <Icon
              name={category.icon}
              size={24}
              color={selectedCategory === category.id ? theme.white : theme.text}
            />
            <Text
              style={[
                styles.categoryText,
                { color: selectedCategory === category.id ? theme.white : theme.text },
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default CategoryPicker; 