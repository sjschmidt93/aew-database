import React from "react"
import { View, Text, ScrollView, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native"
import { sharedStyles, colors } from "../styles"
import { observable, computed } from "mobx"
import Picker from "../components/Picker"
import { observer } from "mobx-react"
import { Event } from "../types"
import { AewApi } from "../aew_api"
import { LabelValue } from "./EventPage"
import { navigate } from "../RootNavigation"

const EVENT_ROW_HEIGHT = 75

@observer
export default class EventsScreen extends React.Component {
  @observable
  events: Event[] = []

  @observable
  selectedPickerIndex = 0
  
  @computed
  get pickerData(): string[] {
    return [
      "ALL",
      "PPV",
      "Dynamite",
      "Dark"
    ]
  }

  @computed
  get dataArr(): Event[][] {
    return [
      this.events,
      this.ppvs,
      this.dynamites,
      this.darks
    ]
  }

  @computed
  get ppvs() {
    return this.events.filter(event => event.program === "ppv")
  }

  @computed
  get darks() {
    return this.events.filter(event => event.program === "dark")
  }

  @computed
  get dynamites() {
    return this.events.filter(event => event.program === "dynamite")
  }

  componentDidMount() {
    this.fetchEvents()
  }

  fetchEvents = async () => this.events = await AewApi.fetchEvents()

  onPickerSelect = (index: number) => this.selectedPickerIndex = index
  
  renderItem = ({item}: { item: Event }) => {
    if (item.program === "ppv") {
      return <PpvRow event={item} />
    }
    if (item.program === "dynamite") {
      return <DynamiteRow event={item} />
    }
  }

  render() {
    return (
      <>
        <Picker options={this.pickerData} selectedIndex={this.selectedPickerIndex} onSelect={this.onPickerSelect} />
        <ScrollView style={sharedStyles.scrollViewContainer}>
          <FlatList
            renderItem={this.renderItem}
            data={this.dataArr[this.selectedPickerIndex]}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          />
        </ScrollView>
      </>
    )
  }
}

function DynamiteRow({ event }: { event: Event }) {
  return (
    <TouchableOpacity
      onPress={() => navigate("Event", { event }) }
      style={[styles.nonPpvRowContainer, styles.ppvRowContainer]}
    >
      <Image source={require("./../assets/images/dynamite-logo.jpg")} style={styles.dynamiteImage} />
      <View style={styles.dynamiteInfoContainer}>
        <Text style={sharedStyles.h2}>Dynamite</Text>
        <Text style={[sharedStyles.h3, { color: colors.silver }]}>{event.date}</Text>
      </View>
    </TouchableOpacity>
  )
}

function PpvRow({ event }: { event: Event }) {
  return (
    <TouchableOpacity
      onPress={() => navigate("Event", { event }) }
      style={styles.ppvRowContainer}
    >
      <Image source={{ uri: event.image_url }} style={styles.ppvImage} />
      <Text style={styles.text}>{event.name} ({event.date})</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  eventRowContainer: {
    backgroundColor: colors.graphite,
    height: EVENT_ROW_HEIGHT
  },
  ppvRowContainer: {
    borderBottomColor: colors.aewYellow,
    borderBottomWidth: 2,
    paddingBottom: 10
  },
  nonPpvRowContainer: {
    flexDirection: 'row'
  },
  dynamiteInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  ppvImage: {
    height: 200,
    width: '100%',
    borderRadius: 5
  },
  dynamiteImage : {
    height: 100,
    width: 100 * (298 / 212),
    borderRadius: 5
  },
  text: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10
  }
})
