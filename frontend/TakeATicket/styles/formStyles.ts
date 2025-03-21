import { StyleSheet } from "react-native";

export default StyleSheet.create({
  title: {
    fontSize: 20,
  },
  formField: {
    width: "100%",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "85%",
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    borderColor: "#4F46E5",
    borderWidth: 0.3,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
  },
});
