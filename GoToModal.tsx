import { View, StyleSheet, Dimensions, Text, Image } from "react-native"
import { observable, action } from "mobx"
import React from "react"
import { observer } from "mobx-react"
import { colors, sharedStyles } from "./styles"
import _ from "lodash"
import { TouchableOpacity } from "react-native-gesture-handler"
import { navigateToRosterMember, RosterMember } from "./screens/RosterScreen"
import { Fontisto } from '@expo/vector-icons'

const dims = Dimensions.get("screen")
const HEIGHT = dims.height
const WIDTH = dims.height

@observer
export default class GoToModal extends React.Component {
  @observable
  static isVisible = false

  @observable
  static items: RosterMember[] = []

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

    return GoToModal.items.map(item => {
      const onPress = () => {
        GoToModal.isVisible = false
        navigateToRosterMember(item)()
      }

      const icon = !_.isNil(item.image_url)
        ? <Image source={{ uri: item.image_url }} style={styles.image} />
        : (
          <View style={styles.iconContainer}>
            <Fontisto size={IMAGE_WIDTH / 2} name="navigate" color={colors.aewYellow} />
          </View>
        )

      return (
        <TouchableOpacity
          onPress={onPress}
          style={styles.barContainer}
        >
          {icon}
          <Text style={sharedStyles.h3}>Go to {item.name}</Text>
        </TouchableOpacity>
      )
    })
  }

  render() {
    return (
      GoToModal.isVisible && (
        <>
          <View onTouchEnd={GoToModal.hide} style={styles.container} />
          <View style={styles.bottomContainer}>
            {this.renderBars()}
          </View>
        </>
      )
    )
  }
}

const IMAGE_WIDTH = 40

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
    alignItems: "center",
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    flexDirection: "row"
  },
  image: {
    height: IMAGE_WIDTH,
    width: IMAGE_WIDTH,
    borderRadius: 50,
    marginRight: 10
  },
  iconContainer: {
    width: IMAGE_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  }
})
