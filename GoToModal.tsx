import { View, StyleSheet, Dimensions, Text, Image, Animated, PanResponder, PanResponderInstance } from "react-native"
import { observable, action } from "mobx"
import React from "react"
import { observer } from "mobx-react"
import { colors, sharedStyles } from "./styles"
import _ from "lodash"
import { TouchableOpacity } from "react-native-gesture-handler"
import { navigateToRosterMember, RosterMember } from "./screens/RosterScreen"
import { Fontisto, Ionicons } from '@expo/vector-icons'
import { isTagTeam } from "./components/MatchList"
import { TagTeam, Wrestler } from "./types"
import { PersonIcon } from "./components/PersonIcon"

const dims = Dimensions.get("screen")
const SCREEN_HEIGHT = dims.height
const SCREEN_WIDTH = dims.width

function hasSubTeams(tagTeam: TagTeam) {
  return !_.isEmpty(tagTeam.sub_teams)
}

@observer
export default class GoToModal extends React.Component {
  @observable
  static isVisible = false

  @observable
  static items: RosterMember[] = []

  @observable
  static yOffset = new Animated.Value(SCREEN_HEIGHT) // might break when modal size > screen_height

  @observable
  static opacity = new Animated.Value(0)

  @observable
  static height = 0

  @action
  static show = (items: RosterMember[]) => {
    GoToModal.items = items
    GoToModal.isVisible = true
    GoToModal.height = GoToModal.items.length * BAR_CONTAINER_HEIGHT
    GoToModal.yOffset.setValue(GoToModal.height)
    GoToModal.showAnimation()
  }

  static showAnimation = () => {
    Animated.parallel([
      Animated.timing(
        GoToModal.yOffset, { toValue: 0 }
      ),
      Animated.timing(
        GoToModal.opacity, { toValue: 0.6 }
      )
    ]).start()
  }

  @action
  static hide = (callback: () => void = () => null) => {
    Animated.parallel([
      Animated.timing(
        GoToModal.yOffset, { toValue: GoToModal.height }
      ),
      Animated.timing(
        GoToModal.opacity, { toValue: 0 }
      )
    ]).start(({ finished }) => {
      if (finished) {
        GoToModal.isVisible = false
        GoToModal.items = []
        callback()
      }
    })
  }

  _panResponder: PanResponderInstance

  constructor(props: {}) {
    super(props)
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gs) => Math.abs(gs.dx) > 30 || Math.abs(gs.dy) > 30,
      onPanResponderMove: (e, gs) => {
        if(gs.dy > 0) {
          GoToModal.yOffset.setValue(gs.dy)
        }
      },
      onPanResponderRelease: (e, gs) => {
        if (gs.dy > GoToModal.height / 3 || gs.vy > 0.45) {
          return GoToModal.hide()
        }
        return GoToModal.showAnimation()
      }
    })
  }

  renderBars = () => {
    if (_.isEmpty(GoToModal.items)) {
      return null
    }

    return GoToModal.items.map(item => {
      const icon = !_.isNil(item.image_url)
        ? <Image source={{ uri: item.image_url }} style={styles.image} />
        : <PersonIcon size={IMAGE_WIDTH} style={{ marginRight: 10 }}/>

      return (
        <View style={styles.outerBarContainer}>
          <TouchableOpacity style={styles.barContainer} onPress={() => GoToModal.hide(navigateToRosterMember(item))}>
            {icon}
            <BarBody item={item} />
          </TouchableOpacity>
        </View>
      )
    })
  }

  render() {
    const transform = { transform: [{ translateY: GoToModal.yOffset }] }

    return (
      GoToModal.isVisible && (
        <>
          <Animated.View onTouchEnd={() => GoToModal.hide()} style={[styles.container, { opacity: GoToModal.opacity }]} />
          <Animated.View  {...this._panResponder.panHandlers}  style={[styles.bottomContainer, transform]}>
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
  <View>
    <Text style={styles.barBodyText}>Go To {isTagTeam(item) ? "Tag Team" : "Wrestler"}</Text>
    <Text style={[sharedStyles.body, { color: colors.silver }]}>{item.name}</Text>
  </View>
)

const IMAGE_WIDTH = 40

const BAR_CONTAINER_HEIGHT = 70
const DRAG_BAR_HEIGHT = 20

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    position: 'absolute',
    top: 0,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH
  },
  barBodyText: {
    fontSize: 14,
    color: colors.white
  },
  bottomContainer: {
    position: "absolute",
    width: SCREEN_WIDTH,
    bottom: 0
  },
  outerBarContainer: {
    justifyContent: "center",
    backgroundColor: colors.graphite,
    height: BAR_CONTAINER_HEIGHT
  },
  barContainer: {
    paddingLeft: 20,
    flexDirection: "row",
    borderBottomColor: colors.black,
    backgroundColor: colors.graphite,
    alignItems: "center"
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
