import React from "react"
import { View, Text, StyleSheet, FlatList, Image } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { sharedStyles, colors } from "../styles"
import { observer } from "mobx-react"
import { observable } from "mobx"
import { AewApi } from "../aew_api"
import ChampionList from "../components/ChampionList"
import { EventList } from "./EventsScreen"

export default class HomeScreen extends React.Component {
  render() {
    return (
      <ScrollView style={sharedStyles.scrollViewContainer}>
        <Text style={sharedStyles.h2}>Champions</Text>
        <ChampionList />
        <Text style={[sharedStyles.h2, { paddingBottom: 10 }]}>Recent Events</Text>
        <RecentEventsList />
        {/* <Text style={sharedStyles.h2}>High-Rated Matches</Text> */}
      </ScrollView>
    )
  }
}

const RECENT_EVENTS_LIMIT = 4

@observer
class RecentEventsList extends React.Component {
  @observable
  events = []

  componentDidMount() {
    this.fetchEvents()
  }

  fetchEvents = async () => this.events = await AewApi.fetchEvents(RECENT_EVENTS_LIMIT)

  render() {
    return <EventList events={this.events} />
  }
}
