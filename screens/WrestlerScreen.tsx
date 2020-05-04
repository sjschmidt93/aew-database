import React from "react"
import { Text, ScrollView, View, StyleSheet, Image, FlatList } from "react-native"
import { computed, observable, action, _interceptReads } from "mobx"
import { sharedStyles, colors } from "../styles"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../App"
import { RouteProp } from "@react-navigation/native"
import { Match, Reign } from "../types"
import { observer } from "mobx-react"
import _ from "lodash"
import { AewApi } from "../aew_api"
import { TouchableOpacity } from "react-native-gesture-handler"
import { AntDesign } from '@expo/vector-icons'
import { _isComputed } from "mobx/lib/internal"
import { formatDate } from "../utils"
import MatchList from "../components/MatchList"

type WrestlerScreenRouteProp = RouteProp<RootStackParamList, "Wrestler">
type Props = {
  route: WrestlerScreenRouteProp
}

@observer
export default class WrestlerScreen extends React.Component<Props> {
  @observable
  matches: Match[] = []

  @observable
  showingMore = false

  componentDidMount() {
    this.fetchMatches()
  }

  fetchMatches = async () => this.matches = await AewApi.fetchWrestlerMatches(this.wrestler.id)

  @computed
  get wrestler() {
    return this.props.route.params.wrestler
  }

  @action
  onPressViewMore = () => this.showingMore = !this.showingMore

  render() {
    return (
      <ScrollView style={sharedStyles.scrollViewContainer}>
        <View style={styles.wrestlerInfoContainer}>
          <Image source={{ uri: this.wrestler.image_url }} style={styles.image} />
          <View style={styles.basicInfoContainer}>
            <LabelValue label="AEW Record" value={`${this.wrestler.num_wins}-${this.wrestler.num_losses}`} />
            <LabelValue label={`${new Date().getFullYear()} Record`} value={"TODO"} />
          </View>
        </View>
        { this.showingMore && (
          <View style={styles.moreContainer}>
            <LabelValue label="Nickname" value={this.wrestler.nickname} />
            <LabelValue label="Height" value={toHeightString(this.wrestler.height)} />
            <LabelValue label="Weight" value={`${this.wrestler.weight} lbs.`} />
            <LabelValue label="Hometown" value={this.wrestler.hometown} />
          </View>
        )}
        <TouchableOpacity style={styles.viewMoreButton} onPress={this.onPressViewMore}>
          <View style={styles.buttonContainer}>
            <Text style={styles.viewMoreText}>{this.showingMore ? "View Less" : "View More"}</Text>
            <AntDesign name={this.showingMore ? "caretup" : "caretdown"} color={colors.white} size={16} />
          </View>
        </TouchableOpacity>
        <Text style={sharedStyles.h2}>Match history</Text>
        <MatchList matches={this.matches} />
        <ReignList reigns={this.wrestler.reigns} />
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
      />
    </View>
  )
}

const toHeightString = (height: number): string => `${Math.floor(height/12)}'${height % 12}"`

function LabelValue({ label, value }: { label: string, value: string }) {
  return !_.isNil(value) && (
    <View>
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
    paddingLeft: 30,
    paddingBottom: 20
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
