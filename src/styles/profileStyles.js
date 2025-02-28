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
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // Imagem de perfil
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
    borderRadius: 20, //Botão de editar
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
    padding: 18,
    marginHorizontal: 20, // Estatísticas
    borderRadius: 20, // altera de 15 para 20
    elevation: 2,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24, // Número de estatísticas
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
    borderRadius: 20, // alterado de 10 para 20
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
    borderRadius: 20, // alterado de 8 para 20
    borderWidth: 1,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  bioSaveButton: {
    padding: 12,
    borderRadius: 20, // alterado de 8 para 20
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
    paddingVertical: 12, // Diminui a altura
    paddingHorizontal: 20, // Diminui a largura
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    alignSelf: 'center', // Mantém alinhado ao centro
    width: '80%', // Ajusta para deixar menor (mude o valor se quiser mais pequeno)
  },
  actionButtonText: {
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
}); 