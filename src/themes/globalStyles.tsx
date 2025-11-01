import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#87CEEB'
    },
    
     scrollContent: {
        flexGrow: 1,
        paddingHorizontal: isSmallScreen ? 12 : 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 40, 
      },

    input: {
    flex: 1,
    paddingLeft: 50,
    paddingRight: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD166',
    fontSize: 16,
    color: '#030303ff',       
    backgroundColor: '#FFF9F2', 
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    backgroundColor: '#FF9F1C',
    shadowColor: '#FF9F1C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },

 });