import { StyleSheet } from "react-native";

export default StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#87CEEB'
    },
    card: {
        width: '85%',
        backgroundColor: '#ffffffff',
        borderRadius: 20,
        padding: 25,
        zIndex: 1,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    logo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#FFD166',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#ffd1667e',
    },
    button: {
        backgroundColor: '#FF9F1C',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#666',
    },
    footerLink: {
        color: '#4a90e2',
        fontWeight: 'bold',
    },

});
