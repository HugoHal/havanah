import React from "react";
import { Modal, View, StyleSheet, Dimensions, TouchableOpacity, Text, TouchableWithoutFeedback } from "react-native";

const { width, height } = Dimensions.get("window");
const DIAMETER = width * 0.92; // Cercle à peine inférieur à la largeur

export default function TripModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  if (!visible) return null;
  return (
    <Modal transparent animationType="none" visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.circle}>
            {/* Bouton Haut */}
            <TouchableOpacity style={[styles.button, styles.top]} onPress={() => alert("Haut !")}>
              <Text style={styles.buttonText}>Haut</Text>
            </TouchableOpacity>
            {/* Bouton Bas */}
            <TouchableOpacity style={[styles.button, styles.bottom]} onPress={() => alert("Bas !")}>
              <Text style={styles.buttonText}>Bas</Text>
            </TouchableOpacity>
            {/* Bouton Gauche */}
            <TouchableOpacity style={[styles.button, styles.left]} onPress={() => alert("Gauche !")}>
              <Text style={styles.buttonText}>Gauche</Text>
            </TouchableOpacity>
            {/* Bouton Droite */}
            <TouchableOpacity style={[styles.button, styles.right]} onPress={() => alert("Droite !")}>
              <Text style={styles.buttonText}>Droite</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const BUTTON_SIZE = DIAMETER * 0.38;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: DIAMETER,
    height: DIAMETER,
    borderRadius: DIAMETER / 2,
    backgroundColor: "#FF9900",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  button: {
    position: "absolute",
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#34573E",
    fontWeight: "bold",
    fontSize: 18,
  },
  top: {
    top: 18,
    left: DIAMETER / 2 - BUTTON_SIZE / 2,
  },
  bottom: {
    bottom: 18,
    left: DIAMETER / 2 - BUTTON_SIZE / 2,
  },
  left: {
    left: 18,
    top: DIAMETER / 2 - BUTTON_SIZE / 2,
  },
  right: {
    right: 18,
    top: DIAMETER / 2 - BUTTON_SIZE / 2,
  },
});