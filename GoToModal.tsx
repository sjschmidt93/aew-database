import { View, StyleSheet, Dimensions, Text, Image, Animated } from "react-native"
import { observable, action, reaction } from "mobx"
import React from "react"
import { observer } from "mobx-react"
import { colors, sharedStyles } from "./styles"
import _ from "lodash"
import { TouchableOpacity } from "react-native-gesture-handler"
import { navigateToRosterMember, RosterMember } from "./screens/RosterScreen"
import { Fontisto } from '@expo/vector-icons'
import { isTagTeam } from "./components/MatchList"
import { Wrestler } from "./types"

const dims = Dimensions.get("screen")
const SCREEN_HEIGHT = dims.height
const SCREEN_WIDTH = dims.width

const HIDDEN_Y_OFFSET = 200 // TODO: calculate height of bars

@observer
export default class GoToModal extends React.Component {
  @observable
  static isVisible = false

  @observable
  static items: RosterMember[] = []

  @observable
  static yOffset = new Animated.Value(HIDDEN_Y_OFFSET)

  @action
  static show = (items: RosterMember[]) => {
    GoToModal.items = items
    GoToModal.isVisible = true
    Animated.timing(
      GoToModal.yOffset, { toValue: 0 }
    ).start()
  }

  @action
  static hide = (callback: () => void = () => null) => {
    Animated.timing(
      GoToModal.yOffset, { toValue: HIDDEN_Y_OFFSET }
    ).start(({ finished }) => {
      if (finished) {
        GoToModal.isVisible = false
        GoToModal.items = []
        callback()
      }
    })
  }

  renderBars = () => {
    if (_.isEmpty(GoToModal.items)) {
      return null
    }

    return GoToModal.items.map((item, index) => {
      const onPress = () => GoToModal.hide(navigateToRosterMember(item))

      const isTeam = isTagTeam(item)

      const icon = !_.isNil(item.image_url)
        ? <Image source={{ uri: item.image_url }} style={styles.image} />
        : (
          <View style={styles.iconContainer}>
            <Fontisto size={IMAGE_WIDTH / 2} name="navigate" color={colors.aewYellow} />
          </View>
        )

      const variableStyle = {
        height: (isTeam ? TAG_TEAM_BAR_CONTAINER_HEIGHT: BAR_CONTAINER_HEIGHT) - (index === 0 ? 20 : 0),
        borderBottomWidth: isTeam ? 3 : 1
      }

      return (
        <TouchableOpacity
          onPress={onPress}
          style={[styles.barContainer, variableStyle]}
        >
          {icon}
          <BarBody item={item} />
        </TouchableOpacity>
      )
    })
  }

  render() {
    const transform = { transform: [{ translateY: GoToModal.yOffset }] }

    return (
      GoToModal.isVisible && (
        <>
          <View onTouchEnd={() => GoToModal.hide()} style={styles.container} />
          <Animated.View style={[styles.bottomContainer, transform]}>
            <View style={styles.dragBar}>
              <View style={styles.dragIndicator} />
            </View>
            {this.renderBars()}
          </Animated.View>
        </>
      )
    )
  }
}

const BarBody = ({ item }: { item: RosterMember }) => (
  isTagTeam(item)
    ? (
      <View>
        <Text style={sharedStyles.h2}>{item.name}</Text>
        <Text style={[sharedStyles.h3, { color: colors.silver }]}>{tagTeamMembersString(item.wrestlers)}</Text>
      </View>
    )
    : <Text style={sharedStyles.h3}>Go to {item.name}</Text>
)

const tagTeamMembersString = (wrestlers: Wrestler[]) => wrestlers.map(wrestler => wrestler.name).join(" & ")

const IMAGE_WIDTH = 40

const BAR_CONTAINER_HEIGHT = 80
const TAG_TEAM_BAR_CONTAINER_HEIGHT = 120
const DRAG_BAR_HEIGHT = 20

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,.6)',
    position: 'absolute',
    top: 0,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH
  },
  bottomContainer: {
    position: "absolute",
    width: SCREEN_WIDTH,
    bottom: 0
  },
  barContainer: {
    paddingLeft: 20,
    alignItems: "center",
    flexDirection: "row",
    borderBottomColor: colors.black,
    backgroundColor: colors.graphite
  },
  dragIndicator: {
    height: 3,
    width: 30,
    backgroundColor: colors.gray
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
  },
  dragBar: {
    height: DRAG_BAR_HEIGHT,
    backgroundColor: colors.graphite,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center"
  }
})
