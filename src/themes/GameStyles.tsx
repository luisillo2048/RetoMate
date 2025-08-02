import { StyleSheet } from "react-native";

export default StyleSheet.create ({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
    fontFamily: 'ComicNeue-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  categoryButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    width: '23%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeCategory: {
    backgroundColor: '#FFF',
  },
  categoryText: {
    color: '#FFF',
    marginTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeCategoryText: {
    color: '#FF758C',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
    marginTop: 10,
  },
  exerciseCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    flexDirection: 'row',
    height: 120,
    elevation: 3,
  },
  exerciseImage: {
    width: '40%',
    height: '100%',
  },
  exerciseInfo: {
    padding: 15,
    flex: 1,
    justifyContent: 'space-between',
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  exerciseDesc: {
    fontSize: 14,
    color: '#666',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  playText: {
    color: '#FF758C',
    fontWeight: 'bold',
    marginRight: 5,
  },
  resourceCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceIcon: {
    backgroundColor: 'rgba(109,213,250,0.2)',
    padding: 8,
    borderRadius: 20,
    marginRight: 15,
  },
  resourceText: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  resourceSource: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
  reinforceButton: {
    marginTop: 25,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reinforceText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
});