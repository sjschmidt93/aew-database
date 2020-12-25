import React from "react"
import { Text, ScrollView, View, StyleSheet, Image, FlatList, Animated } from "react-native"
import { observable, _interceptReads, action, reaction, computed } from "mobx"
import { sharedStyles, colors } from "../styles"
import { RootStackParamList } from "../App"
import { RouteProp } from "@react-navigation/native"
import { Match, Reign, Wrestler } from "../types"
import { observer } from "mobx-react"
import _ from "lodash"
import { AewApi } from "../aew_api"
import { TouchableOpacity } from "react-native-gesture-handler"
import { AntDesign } from '@expo/vector-icons'
import { formatDate } from "../utils"
import MatchList from "../components/MatchList"

type WrestlerScreenRouteProp = RouteProp<RootStackParamList, "Wrestler">
type Props = {
  route: WrestlerScreenRouteProp
}

// better name?
interface LabelValueConfig {
  label: string
  valueFunc: (wrestler: Wrestler) => string
  dependentField: keyof Wrestler
}

const showMoreConfig: LabelValueConfig[] = [
  {
    label: "Nickname", 
    valueFunc: wrestler => wrestler.nickname,
    dependentField: "nickname"
  },
  {
    label: "Height", 
    valueFunc: wrestler => toHeightString(wrestler.height),
    dependentField: "height"
  },
  {
    label: "Weight", 
    valueFunc: wrestler => `${wrestler.weight} lbs.`,
    dependentField: "weight"
  },
  {
    label: "Hometown", 
    valueFunc: wrestler => wrestler.hometown,
    dependentField: "hometown"
  }
]


const renderLabelValue = (config: LabelValueConfig, wrestler: Wrestler) => {
  if (_.isNil(config.dependentField)) {
    return null
  }
  return <LabelValue label={config.label} value={config.valueFunc(wrestler)} />
}

@observer
export default class WrestlerScreen extends React.Component<Props> {
  @observable
  matches: Match[] = []

  @observable
  showingMore = false

  @observable
  showMoreHeight = new Animated.Value(0)

  labels = showMoreConfig.map(config => renderLabelValue(config, this.wrestler))
  
  @computed
  get wrestler() {
    return this.props.route.params.wrestler
  }

  @action
  fetchMatches = async () => this.matches = await AewApi.fetchWrestlerMatches(this.wrestler.id)

  @action
  onPressViewMore = () => this.showingMore = !this.showingMore

  heightReaction = reaction(
    () => this.showingMore,
    showingMore => (
      Animated.timing(
        this.showMoreHeight,
        { toValue: showingMore ? this.labels.length * LABEL_VALUE_HEIGHT + SHOW_MORE_MARGIN_BOTTOM : 0 }
      ).start()
    )
  )

  wrestlerReaction = reaction(
    () => this.wrestler,
    this.fetchMatches
  )

  componentDidMount() {
    this.fetchMatches()
  }

  componentWillUnmount() {
    this.heightReaction()
    this.wrestlerReaction()
  }

  render() {
    return (
      <ScrollView style={sharedStyles.scrollViewContainer}>
        <View style={styles.wrestlerInfoContainer}>
          <Image source={{ uri: this.wrestler.image_url }} style={styles.image} />
          <View style={styles.basicInfoContainer}>
            <LabelValue label="AEW Record" value={toRecordString(this.wrestler)} />
            <LabelValue label={`${new Date().getFullYear()} Record`} value={"TODO"} />
          </View>
        </View>
        <View style={styles.moreContainer}>
          <Animated.View style={[styles.animatedContainer, { height: this.showMoreHeight }]}>
            {this.labels}
          </Animated.View>
        </View>
        <TouchableOpacity style={styles.viewMoreButton} onPress={this.onPressViewMore}>
          <View style={styles.buttonContainer}>
            <Text style={styles.viewMoreText}>{`View ${this.showingMore ? "Less" : "More"}`}</Text>
            <AntDesign name={this.showingMore ? "caretup" : "caretdown"} color={colors.white} size={16} />
          </View>
        </TouchableOpacity>
        <Text style={sharedStyles.h2}>Match history</Text>
        <MatchList matches={this.matches} wrestler={this.wrestler} />
        { !_.isNil(this.wrestler.reigns) && <ReignList reigns={this.wrestler.reigns} /> }
      </ScrollView> 
    )
  }
}

function ReignRow({ reign }: { reign: Reign }) {
  const dateStr = `${formatDate(reign.start_date)} - ${!_.isNil(reign.end_date) ? formatDate(reign.end_date) : "present"}`
  return (
    <View style={styles.reignRowContainer}>
      <Image source={{ uri: reign.championship.image_url }} style={styles.championshipImage} />
      <Text style={[sharedStyles.h2, { textAlign: "center" }]}>{reign.championship.name}</Text>
      <Text style={styles.reignDate}>{dateStr}</Text>
    </View>
  )
}

function ReignList({ reigns }: { reigns: Reign[] }) {
  return reigns.length > 0 && (
    <View>
      <Text style={sharedStyles.h2}>Title reigns</Text>
      <FlatList
        data={reigns}
        renderItem={({item}: { item: Reign }) => <ReignRow reign={item}/ > }
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  )
}

export const toHeightString = (height: number): string => `${Math.floor(height/12)}'${height % 12}"`
export const toRecordString = (wrestler: Wrestler) => `${wrestler.num_wins} - ${wrestler.num_losses}`
export const toWeightString = (weight: number) => `${weight} lbs`

const LABEL_VALUE_HEIGHT = 50
const SHOW_MORE_MARGIN_BOTTOM = 5

const LabelValue = ({ label, value }: { label: string, value: string }) => {
  return (
    <View style={{ height: LABEL_VALUE_HEIGHT }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrestlerInfoContainer: {
    flexDirection: "row",
    paddingBottom: 10
  },
  moreContainer: {
    paddingLeft: 30
  },
  animatedContainer: {
    overflow: "hidden",
    marginBottom: SHOW_MORE_MARGIN_BOTTOM
  },
  basicInfoContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 5
  },
  viewMoreButton: {
    alignSelf: "center",
    borderColor: colors.aewYellow,
    borderWidth: 3,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderRadius: 20
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  image: {
    height: 120,
    width: 120,
    marginRight: 20
  },
  viewMoreText: {
    color: colors.silver,
    paddingRight: 3
  },
  label: {
    color: colors.white,
    fontSize: 16
  },
  value: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 20
  },
  reignRowContainer: {
    backgroundColor: colors.graphite,
    alignItems: "center",
    padding: 10
  },
  championshipImage: {
    height: 75,
    width: 75 * (1920 / 572)
  },
  reignDate: {
    color: "white",
    fontSize: 16
  }
})
