import React from "react"
import { Text, ScrollView, StyleSheet, FlatList, View } from "react-native"
import { computed, observable } from "mobx"
import { sharedStyles } from "../styles"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../App"
import { RouteProp } from "@react-navigation/native"
import { WrestlerRow, API_URL, GRAPHITE } from "./RosterScreen"
import { Match, MATCH_TYPE, TagTeam, Wrestler } from "../types"
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
        <WrestlerRow wrestler={this.wrestler} />
        <Text style={sharedStyles.h2}>Match history</Text>
        <FlatList
          renderItem={({item}) => <MatchRow match={item} wrestlerName={this.wrestler.name} />}
          data={this.matches}
        />
      </ScrollView>
    )
  }
}

type MatchRowProps = {
  match: Match
  wrestlerName: string
}

class MatchRow extends React.Component<MatchRowProps> {
  @computed
  get isTag() {
    return this.match.match_type === MATCH_TYPE.Tag
  }

  @computed
  get wrestlerName() {
    return this.props.wrestlerName
  }
  
  @computed 
  get isWinner() {
    return this.isTag
      ? this.props.match.winning_team.includes(this.wrestlerName)
      : this.props.match.winner == this.wrestlerName
  }

  @computed
  get winLossText() {
    return this.isWinner ? "WIN" : 'LOSS'
  }

  @computed
  get match() {
    return this.props.match
  }

  @computed
  get event() {
    return this.match.event
  }

  @computed
  get vsText() {
    const teamsOrWrestlers = this.isTag ? this.match.tag_teams : this.match.wrestlers
    return teamsOrWrestlers.map(teamOrWrestler => teamOrWrestler.name).join( " vs. ")
  }

  render() {
    const winLossTextStyle = {
      color: this.isWinner ? "green" : 'red',
      fontWeight: 'bold'
    }
    return (
      <View style={styles.matchContainer}>
        <View style={styles.container}>
          <Text numberOfLines={2} style={[sharedStyles.h3, styles.vsText]}>{this.vsText}</Text>
          <Text style={sharedStyles.body}>{this.event.name}, {this.event.date}</Text>
          <Text style={winLossTextStyle}>{this.winLossText}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  matchContainer: {
    //height: 85,
    backgroundColor: GRAPHITE,
    padding: 5
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  vsText: {
    textAlign: 'center'
  }
})