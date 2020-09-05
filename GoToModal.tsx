import { View, StyleSheet, Dimensions, Text, Image } from "react-native"
import { observable, action } from "mobx"
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
      
      const isTeam = isTagTeam(item)

      const icon = !_.isNil(item.image_url)
        ? <Image source={{ uri: item.image_url }} style={styles.image} />
        : (
          <View style={styles.iconContainer}>
            <Fontisto size={IMAGE_WIDTH / 2} name="navigate" color={colors.aewYellow} />
          </View>
        )

      const variableStyle = {
        height: isTeam ? TAG_TEAM_BAR_CONTAINER_HEIGHT: BAR_CONTAINER_HEIGHT,
        borderBottomColor: isTeam ? colors.black : colors.black,
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
    paddingLeft: 20,
    alignItems: "center",
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
