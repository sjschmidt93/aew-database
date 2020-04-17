import React from "react"
import { Text, StyleSheet, ScrollView, Image, FlatList, View } from "react-native"
import { RouteProp } from "@react-navigation/native"
import { RootStackParamList } from "../App"
import { StackNavigationProp } from "@react-navigation/stack"
import { computed, observable } from "mobx"
import { sharedStyles } from "../styles"
import { AEW_YELLOW } from "./RosterScreen"
import { AewApi } from "../aew_api"
import { Match } from "../types"
import { observer } from "mobx-react"
import { MatchList } from "../components/MatchList"

type EventPageNavigationProp = StackNavigationProp<RootStackParamList, 'Event'>
type EventPageRouteProp = RouteProp<RootStackParamList, 'Event'>
type Props = {
  navigation: EventPageNavigationProp
  route: EventPageRouteProp
}

@observer
export default class EventPage extends React.Component<Props> {
  componentDidMount() {
    this.fetchMatches()
  }

  @observable
  matches: Match[] = []

  fetchMatches = async () => this.matches = await AewApi.fetchEventMatches(this.event.id)

  @computed
  get event() {
    return this.props.route.params.event
  }
  
  render() {
    return (
      <ScrollView style={sharedStyles.scrollViewContainer}>
        <Image source={{ uri: this.event.image_url }} style={styles.eventImage} />
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <LabelValue label={"name"} value={this.event.name} />
            <LabelValue label={"date"} value={this.event.date.toString()} align="right" />
          </View>
          <View style={styles.infoRow}>
            <LabelValue label={"venue"} value={this.event.venue} />
            <LabelValue label={"city"} value={this.event.city} align="right" />
          </View>
        </View>
        <Text style={[sharedStyles.h2, styles.header]}>Card</Text>
        <MatchList matches={this.matches} />
      </ScrollView>
    )
  }
}

type LabelValueProps = {
  label: string
  value: string
  align: "left" | "right"
}

function LabelValue({label, value, align = "left"}: LabelValueProps) {
  const textAlign = { textAlign: align }
  return (
    <View style={styles.labelValueContainer}>
      <Text style={[styles.label, textAlign]}>{label.toUpperCase()}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  eventImage: {
    //width: 400,
    height: 200,
    borderRadius: 5,
    marginBottom: 10
  },
  label: {
    color: AEW_YELLOW,
    fontSize: 24,
    fontWeight: 'bold'
  },
  value: {
    color: 'white',
    fontSize: 16
  },
  header: {
    paddingTop: 5,
    paddingLeft: 10
  },
  labelValueContainer: {
    paddingBottom: 10
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoContainer: {
    paddingHorizontal: 10
  }
})
