import React from "react"
import { Text, ScrollView, View, StyleSheet, Image, FlatList } from "react-native"
import { computed, observable } from "mobx"
import { sharedStyles, colors } from "../styles"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../App"
import { RouteProp } from "@react-navigation/native"
import { Match, Reign } from "../types"
import { observer } from "mobx-react"
import _ from "lodash"
import { MatchList } from "../components/MatchList"
import { AewApi } from "../aew_api"

type WrestlerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Wrestler'>
type WrestlerScreenRouteProp = RouteProp<RootStackParamList, 'Wrestler'>
type Props = {
  navigation: WrestlerScreenNavigationProp
  route: WrestlerScreenRouteProp
}

@observer
export default class WrestlerScreen extends React.Component<Props> {
  @observable
  matches: Match[] = []

  componentDidMount() {
    this.fetchMatches()
  }

  fetchMatches = async () => this.matches = await AewApi.fetchWrestlerMatches(this.wrestler.id)

  @computed
  get wrestler() {
    return this.props.route.params.wrestler
  }

  render() {
    return (
      <ScrollView style={sharedStyles.scrollViewContainer}>
        <View style={styles.wrestlerInfoContainer}>
          <Image source={{ uri: this.wrestler.image_url }} style={styles.image} />
          <View>
            <LabelValue label="AEW Record" value={`${this.wrestler.num_wins}-${this.wrestler.num_losses}`} />
            <LabelValue label={`${new Date().getFullYear()} Record`} value={"TODO"} />
            {/* <LabelValue label="Height" value={toHeightString(this.wrestler.height)} />
            <LabelValue label="Weight" value={`${this.wrestler.weight} lbs.`} /> */}
          </View>
        </View>
        <Text style={sharedStyles.h2}>Match history</Text>
        <MatchList matches={this.matches} />
        <ReignList reigns={this.wrestler.reigns} />
      </ScrollView> 
    )
  }
}

function ReignRow({ reign }: { reign: Reign }) {
  return (
    <View style={styles.reignRowContainer}>
      <Image source={{ uri: reign.championship.image_url }} style={styles.championshipImage} />
      <Text style={sharedStyles.h2}>{reign.championship.name}</Text>
      <Text style={sharedStyles.h3}>{`${reign.length} days${_.isNil(reign.end_date) ? " (ongoing)" : ""}`}</Text>
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
  return (
    <View style={{ paddingBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrestlerInfoContainer: {
    flexDirection: "row",
    paddingBottom: 20
  },
  image: {
    height: 100,
    width: 100,
    marginRight: 20
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
  }
})
