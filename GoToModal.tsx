import { View, StyleSheet } from "react-native"
import { observable } from "mobx"
import React from "react"
import { observer } from "mobx-react"
import { colors } from "./styles"

@observer
export default class GoToModal extends React.Component {
  @observable
  static isVisible = true

  render() {
    return GoToModal.isVisible && (
      <View style={styles.container}>

        <View style={styles.bottomContainer}>

        </View>
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",//"rgba(0,0,0,0.5)",
    position: "absolute",
    bottom: 0,
    height: 200,
    width: 200
  },
  bottomContainer: {
    bottom: 0,
    position: "absolute",
    backgroundColor: colors.graphite,
    height: 300
  }
})