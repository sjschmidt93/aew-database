import { View, StyleSheet, Dimensions, Text } from "react-native"
import { observable, action } from "mobx"
import React from "react"
import { observer } from "mobx-react"
import { colors, sharedStyles } from "./styles"
import { TagTeam, Wrestler } from "./types"
import _ from "lodash"
import { TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight } from "react-native-gesture-handler"

const dims = Dimensions.get("screen")
const HEIGHT = dims.height
const WIDTH = dims.height

type Item = TagTeam | Wrestler // | ...

@observer
export default class GoToModal extends React.Component {
  @observable
  static isVisible = false

  @observable
  static items: Item[] = []

  @action
  static show = (items: Item[]) => {
    GoToModal.items = items
    GoToModal.isVisible = true
  }

  @action
  static hide = () => {
    GoToModal.isVisible = false
    GoToModal.items = []
  }

  renderBars = () => {
    if (_.isEmpty(GoToModal.items)) {
      return null
    }
    // if is tag team ...
    return GoToModal.items.map(item => (
      <TouchableOpacity style={styles.barContainer}>
        <Text style={sharedStyles.h3}>Go to {item.name}</Text>
      </TouchableOpacity>
    ))
  }

  render() {
    return (
      GoToModal.isVisible && (
        <>
          <View onTouchEnd={GoToModal.hide} style={styles.container} />
          <View style={[styles.bottomContainer]}>
            {this.renderBars()}
          </View>
        </>
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
    backgroundColor: colors.graphite,
    position: "absolute",
    bottom: 0,
    width: WIDTH
  },
  barContainer: {
    height: 80,
    paddingLeft: 20,
    justifyContent: "center",
    borderBottomColor: colors.black,
    borderBottomWidth: 1
  }
})