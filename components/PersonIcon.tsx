import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native"
import { colors } from "../styles"

export const PersonIcon = ({ size, style = null }: { size: number, style?: StyleProp<ViewStyle> }) => {
  const circleStyle = {
    height: size,
    width: size
  }
  return (
    <View style={[styles.imageCircle, circleStyle, style]}>
      <Ionicons name="ios-person" size={size * 0.75} color={colors.white} />
    </View>
  )
}

const styles = StyleSheet.create({
  imageCircle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.silver,
    borderRadius: 100
  }
})
