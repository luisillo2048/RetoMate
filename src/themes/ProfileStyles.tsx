import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8DC",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: "#333",
    marginVertical: 5,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF6F61",
    marginBottom: 10,
    textAlign: "center",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#FFF0F5",
    padding: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    width: "100%",
  },
  progressItem: {
    backgroundColor: "#E6E6FA",
    padding: 15,
    marginVertical: 8,
    borderRadius: 15,
    width: "100%",
  },
  progressBar: {
    marginTop: 10,
  },
  flatListContainer: {
    paddingBottom: 50,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
});

export default styles;
