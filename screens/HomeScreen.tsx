import React, { useContext } from "react"
import { Text } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { sharedStyles } from "../styles"
import ChampionList from "../components/ChampionList"
import { EventList } from "./EventsScreen"
import _ from "lodash"
import DataContext from "../DataContext"
import LoadingIndicator from "../components/LoadingIndicator"

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

const RecentEventsList = () => {
  const { events } = useContext(DataContext)

  return _.isEmpty(events)
    ? <LoadingIndicator />
    : <EventList events={events.slice(0, RECENT_EVENTS_LIMIT)} />
}
