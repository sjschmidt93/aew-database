import { View, StyleSheet, Text, Dimensions } from "react-native"
import { observable } from "mobx"
import React from "react"
import { observer } from "mobx-react"
import { colors } from "./styles"

const dims = Dimensions.get("screen")
const HEIGHT = dims.height
const WIDTH = dims.height

@observer
export default class GoToModal extends React.Component {
  @observable
  static isVisible = false

  render() {
    return (
      GoToModal.isVisible && (
        <View style={styles.container}>
          <View style={styles.bottomContainer}>

          </View>
        </View>
      )
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,.6)',
    position: 'absolute',
    top: 0,
    height: HEIGHT,
    width: WIDTH
  },
  bottomContainer: {
    height: 400,
    backgroundColor: colors.graphite,
    position: "absolute",
    bottom: 0,
    width: WIDTH
  }
})