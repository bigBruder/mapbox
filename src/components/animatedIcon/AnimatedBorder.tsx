import { colors } from "@/constants/colors";
import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, Image, StyleSheet } from "react-native";

interface AnimatedGlowBorderImageProps {
  pathToImage: string;
  style?: any;
  isShouldPlayAnimation?: boolean;
}

export const AnimatedGlowBorderImage: React.FC<
  AnimatedGlowBorderImageProps
> = ({ style, isShouldPlayAnimation }) => {
  const glowValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const startAnimations = () => {
    Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 0.95, // Збільшення
            duration: 1000, // Тривалість розширення
            easing: Easing.out(Easing.ease), // Плавне розширення
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1.05, // Легке розширення
            duration: 300, // Тривалість легкого розширення
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 0.95, // Швидке стиснення
            duration: 300, // Тривалість стискання
            easing: Easing.in(Easing.ease), // Швидке стискання
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1.05, // Легке розширення
            duration: 300, // Тривалість легкого розширення
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1, // Повернення до початкового розміру
            duration: 200, // Тривалість повернення
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1, // Тривалий стан
            duration: 1000, // Пауза
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowValue, {
            toValue: 0.2, // Збільшення
            duration: 1000, // Тривалість розширення
            easing: Easing.out(Easing.ease), // Плавне розширення
            useNativeDriver: true,
          }),
          Animated.timing(glowValue, {
            toValue: 1, // Легке розширення
            duration: 300, // Тривалість легкого розширення
            useNativeDriver: true,
          }),
          Animated.timing(glowValue, {
            toValue: 0.5, // Швидке стиснення
            duration: 300, // Тривалість стискання
            easing: Easing.in(Easing.ease), // Швидке стискання
            useNativeDriver: true,
          }),
          Animated.timing(glowValue, {
            toValue: 1, // Легке розширення
            duration: 300, // Тривалість легкого розширення
            useNativeDriver: true,
          }),
          Animated.timing(glowValue, {
            toValue: 0, // Повернення до початкового розміру
            duration: 200, // Тривалість повернення
            useNativeDriver: true,
          }),
          Animated.timing(glowValue, {
            toValue: 0, // Тривалий стан
            duration: 1000, // Пауза
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  };

  useEffect(() => {
    if (isShouldPlayAnimation) {
      startAnimations();
    } else {
      glowValue.setValue(0);
      scaleValue.setValue(1);
    } // reset animations
  }, [isShouldPlayAnimation]);

  const glow = glowValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5],
  });

  return (
    <View style={styles.container}>
      <View style={styles.borderContainer}>
        <Animated.Image
          source={require("@/assets/icons/polygon.png")}
          style={[
            styles.image,
            style,
            styles.animatedBorder,
            {
              shadowRadius: glow,
              transform: [{ scale: scaleValue }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  borderContainer: {
    position: "relative",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  animatedBorder: {
    position: "absolute",
    borderColor: colors.pulsePrimary,

    borderRadius: 50,
  },
  image: {
    objectFit: "cover",
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowColor: colors.pulsePrimary,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
  },
});

export default AnimatedGlowBorderImage;
