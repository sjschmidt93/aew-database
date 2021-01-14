import React from "react"
import { ActivityIndicator, StyleSheet } from "react-native"
import { colors } from "../styles"

const LoadingIndicator = () => (
  <ActivityIndicator style={styles.activityIndicator} size="large" color={colors.aewYellow} />
)

const styles = StyleSheet.create({
  activityIndicator: {
    marginTop: 20
  }
})

export default LoadingIndicator
