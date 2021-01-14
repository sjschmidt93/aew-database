import React, { useContext } from "react"
import { ActivityIndicator, Text } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { colors, sharedStyles } from "../styles"
import ChampionList from "../components/ChampionList"
import { EventList } from "./EventsScreen"
import _ from "lodash"
import DataContext from "../DataContext"

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

// @observer
// class RecentEventsList extends React.Component {
//   @observable
//   events = []

//   componentDidMount() {
//     this.fetchEvents()
//   }

//   fetchEvents = async () => this.events = await AewApi.fetchEvents(RECENT_EVENTS_LIMIT)

//   render() {
//     return _.isEmpty(this.events)
//       ? <ActivityIndicator size="large" color={colors.aewYellow} />
//       : <EventList events={this.events} />
//   }
// }

const RecentEventsList = () => {
  const { events } = useContext(DataContext)

  return _.isEmpty(events)
    ? <ActivityIndicator size="large" color={colors.aewYellow} />
    : <EventList events={events.slice(0, RECENT_EVENTS_LIMIT)} />
}