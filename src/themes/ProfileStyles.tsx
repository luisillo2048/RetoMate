import { StyleSheet } from "react-native";

export default StyleSheet.create ({
    container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  profileSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "dodgerblue",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginTop: 10,
    color: "#333",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  progressItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
    width: "100%",
  },
  progressBar: {
    marginVertical: 20,
    width: "100%",
  },
  flatListContainer: {
    paddingBottom: 20,
  },
});
