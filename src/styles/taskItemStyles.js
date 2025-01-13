import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  taskItem: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    elevation: 3,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 12,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  saveButton: {
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  priorityLabel: {
    fontStyle: 'italic',
    fontSize: 12,
  },
  baixaPriority: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CD964',
  },
  médiaPriority: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFCC00',
  },
  altaPriority: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
}); 