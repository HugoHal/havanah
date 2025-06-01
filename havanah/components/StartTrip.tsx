import React, { forwardRef } from "react";
import { Pressable, StyleSheet, Animated, Image, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const FINAL_SIZE = width * 0.92; // même que TripModal
const BUTTON_SIZE = 80;
const X_OFFSET = -20; // Décalage vers la gauche à la fin de l'animation
const Y_OFFSET = 4;

export interface StartTripRef {
  playOpen: () => void;
  playClose: () => void;
}

const StartTrip = forwardRef<StartTripRef, {
  onOpen: () => void;
  animation: Animated.Value;
}>(({ onOpen, animation }, ref) => {
  // Positions
  const startX = width - BUTTON_SIZE / 2;
  const startY = BUTTON_SIZE / 2;
  const endX = width / 2;
  const endY = height / 2;

  // Interpolations
  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, FINAL_SIZE / BUTTON_SIZE],
  });
  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(startX - endX) - X_OFFSET],
  });
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, endY - startY - Y_OFFSET],
  });
  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  React.useImperativeHandle(ref, () => ({
    playOpen: () => {
      Animated.timing(animation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start(onOpen);
    },
    playClose: () => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    },
  }));

  return (
    <Animated.View
      style={[
        styles.animatedButton,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
            { rotate },
          ],
        },
      ]}
    >
      <Pressable style={styles.button} onPress={() => ref && (ref as any).current.playOpen()}>
        <Image
          source={require("../assets/images/trip_image.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </Pressable>
    </Animated.View>
  );
});

export default StartTrip;

const styles = StyleSheet.create({
  animatedButton: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  image: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
  },
});