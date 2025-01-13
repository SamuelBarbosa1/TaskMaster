import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    marginBottom: 20,
    marginTop: 50,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderRadius: 20,
    padding: 10,
    elevation: 5,
  },
  username: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 2,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  section: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  bioEditContainer: {
    marginTop: 10,
  },
  bioInput: {
    padding: 15,
    borderRadius: 8,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  bioSaveButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  bioSaveButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalInput: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    fontSize: 16,
  },
  goalSaveButton: {
    padding: 15,
    borderRadius: 8,
  },
  actionButtons: {
    padding: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  actionButtonText: {
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
}); 