import React from "react"
import { Text, ScrollView, StyleSheet, FlatList, View, Image, TouchableOpacity } from "react-native"
import { computed, observable } from "mobx"
import { sharedStyles } from "../styles"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../App"
import { RouteProp } from "@react-navigation/native"
import { API_URL, GRAPHITE } from "./RosterScreen"
import { Match, MATCH_TYPE } from "../types"
import { observer } from "mobx-react"
import _ from "lodash"

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

  fetchMatches = () => {
    const url = `${API_URL}/wrestlers/${this.wrestler.id}/matches`
    fetch(url)
      .then(res => res.json())
      .then(data => this.matches = data)
  }

  @computed
  get wrestler() {
    return this.props.route.params.wrestler
  }

  render() {
    return (
      <ScrollView style={sharedStyles.scrollViewContainer}>
        <Text style={sharedStyles.h2}>Match history</Text>
        <FlatList
          renderItem={({item}) => <MatchRow match={item} />}
          data={this.matches}
          contentContainerStyle={{ paddingTop: 10 }}
        />
        <Text style={sharedStyles.h2}>Title reigns</Text>
      </ScrollView>
    )
  }
}

type MatchRowProps = {
  match: Match
}

class MatchRow extends React.Component<MatchRowProps> {
  render() {
    if (this.props.match.type == "singles") {
      return <SinglesMatchRow match={this.props.match} />
    }
    return <TagTeamMatchRow match={this.props.match} />
  }
 }


class SinglesMatchRow extends React.Component<MatchRowProps> {
  @computed
  get match() {
    return this.props.match
  }

  @computed
  get event() {
    return this.match.event
  }

  render() {
    return (
      <View style={styles.matchContainer}>
        <View style={styles.container}>
          <WrestlerWithImage match={this.match} wrestler={this.match.wrestlers[0]} />
          <Text style={sharedStyles.h2}>vs.</Text>
          <WrestlerWithImage match={this.match} wrestler={this.match.wrestlers[1]} />
        </View>
        <TouchableOpacity>
          <Text style={styles.eventName}>{this.event.name} ({this.event.date})</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class TagTeamMatchRow extends React.Component<MatchRowProps> {
  @computed
  get match() {
    return this.props.match
  }

  @computed
  get event() {
    return this.match.event
  }

  render() {
    return (
      <View style={styles.matchContainer}>
        <View style={styles.container}>
          <TagTeamWithImages tagTeam={this.match.tag_teams[0]} match={this.match} />
          <Text style={sharedStyles.h2}>vs.</Text>
          <TagTeamWithImages tagTeam={this.match.tag_teams[1]} match={this.match} />
        </View>
        <TouchableOpacity>
          <Text style={styles.eventName}>{this.event.name} ({this.event.date})</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

type TagTeamWithImagesProps = {
  tagTeam: TagTeam
  match: Match
}

function TagTeamWithImages({ tagTeam, match }: TagTeamWithImagesProps) {
  const isWinner = match.winner === tagTeam.name
  return (
    <View style={styles.wrestlerContainer}>
      <View style={{ flexDirection: 'row' }}>
        <Image style={styles.image} source={{ uri: tagTeam.wrestlers[0].image_url }} />
        <Image style={styles.image} source={{ uri: tagTeam.wrestlers[1].image_url }} />
      </View>
      <Text style={sharedStyles.body}>{tagTeam.name}</Text>
      <Text style={[styles.bold, { color: isWinner ? 'green' : 'red' }]}>{isWinner ? "WIN" : "LOSS"}</Text>
    </View>
  )
}

type WrestlerWithImageProps = {
  wrestler: Wrestler
  match: Match
}

function WrestlerWithImage({ wrestler, match }: WrestlerWithImageProps) {
  const isWinner = match.winner === wrestler.name
  return (
    <View style={styles.wrestlerContainer}>
      <Image style={styles.image} source={{ uri: wrestler.image_url }}/>
      <Text style={sharedStyles.body}>{wrestler.name}</Text>
      <Text style={[styles.bold, { color: isWinner ? 'green' : 'red' }]}>{isWinner ? "WIN" : "LOSS"}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  matchContainer: {
    backgroundColor: GRAPHITE,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginBottom: 10
  },
  wrestlerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    //alignSelf: 'center'
    //flex: 1
  },
  bold: {
    fontWeight: 'bold'
  },
  image: {
    height: 75,
    width: 75,
    margin: 2.5
  },
  eventName: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    paddingTop: 10
  }
})