import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ImageBackground, Dimensions, SafeAreaView } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get("window");
const BG_HEIGHT = 200;

const QUESTIONS = [
  "Où veux-tu aller ?",
  "Combien de jours veux-tu partir ?",
  "Quel est ton budget ?",
];

export default function CreateTripModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(""));

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      console.log("Réponses :", answers);
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleChange = (text: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = text;
    setAnswers(newAnswers);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.greenPart}>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{QUESTIONS[step]}</Text>
            {/* Ajoute ici un TextInput ou Picker selon la question */}
          </View>

          <View style={styles.navContainer}>
            {step > 0 && (
              <TouchableOpacity onPress={handlePrev} style={styles.navButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleNext} style={styles.navButton}>
              <Ionicons name={step === QUESTIONS.length - 1 ? "checkmark" : "arrow-forward"} size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${((step + 1) / QUESTIONS.length) * 100}%` }]} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#82A189",
  },
  backgroundImage: {
    width: "100%",
    height: BG_HEIGHT,
    justifyContent: "flex-start",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 6,
  },
  greenPart: {
    flex: 1,
    backgroundColor: "#82A189",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -25,
    padding: 24,
    justifyContent: "space-between",
  },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  questionText: {
    fontSize: 22,
    color: "#34573E",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  navButton: {
    backgroundColor: "#34573E",
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 10,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#bec4c7",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#FF9900",
    borderRadius: 4,
  },
});