import { View, TouchableOpacity, Text, FlatList, StyleSheet, Image } from "react-native"
import { computed } from "mobx"
import { navigate } from "../RootNavigation"
import React from "react"
import { sharedStyles, colors } from "../styles"
import { Match, Wrestler } from "../types"
import _ from "lodash"

type MatchListProps = {
  matches: Match[]
  showEvents?: boolean
}

export function MatchList({ matches, showEvents = true }: MatchListProps) {
  return (
    <FlatList
      renderItem={({item}) => <MatchRow match={item} showEvent={showEvents} />}
      data={matches}
      contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
    />
  )
}

type MatchRowProps = {
  match: Match
  showEvent: boolean
}

export class MatchRow extends React.Component<MatchRowProps> {
  render() {
    if (this.props.match.type == "singles") {
      return <SinglesMatchRow {...this.props} />
    }
    return <TagTeamMatchRow {...this.props} />
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
        { this.props.showEvent && (
          <TouchableOpacity onPress={() => navigate('Event', { event: this.event })}>
            <Text style={styles.eventName}>{this.event.name} ({this.event.date})</Text>
          </TouchableOpacity>
        )}
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
        {this.props.showEvent && (
          <TouchableOpacity onPress={() => navigate('Event', { event: this.event })}>
            <Text style={styles.eventName}>{this.event.name} ({this.event.date})</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

type TagTeamWithImagesProps = {
  tagTeam: TagTeam
  match: Match
}

class TagTeamWithImages extends React.Component<TagTeamWithImagesProps> {
  @computed
  get tagTeam() {
    return this.props.tagTeam
  }

  @computed
  get match() {
    return this.props.match
  }

  @computed
  get isWinner() {
    return this.match.winner === this.tagTeam.name
  }

  @computed
  get rows(): Wrestler[][] {
    return _.chunk(this.tagTeam.wrestlers, this.tagTeam.wrestlers.length <= 4 ? 2 : 3)
  }

  render () {
    return (
      <View style={styles.wrestlerContainer}>
        <View style={{ alignItems: "center" }}>
          { this.rows.map(row => <ImageRow wrestlers={row} />) }
        </View>
        <Text style={sharedStyles.body}>{this.tagTeam.name}</Text>
        <Text style={[styles.bold, { color: this.isWinner ? 'green' : 'red' }]}>{this.isWinner ? "WIN" : "LOSS"}</Text>
      </View>
    )
  }
}

function ImageRow({ wrestlers }: { wrestlers: Wrestler[] }) {
  const imageStyle = { height: 60, width: 60, marginRight: 5 }
  return (
    <View style={{ flexDirection: "row", paddingBottom: 5 }}>
      { wrestlers.map(wrestler => <Image style={imageStyle} source={{ uri: wrestler.image_url }} />) }
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
    <TouchableOpacity style={styles.wrestlerContainer} onPress={() => navigate("Wrestler", { wrestler })}>
      <Image style={styles.image} source={{ uri: wrestler.image_url }}/>
      <Text style={sharedStyles.body}>{wrestler.name}</Text>
      <Text style={[styles.bold, { color: isWinner ? 'green' : 'red' }]}>{isWinner ? "WIN" : "LOSS"}</Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  matchContainer: {
    backgroundColor: colors.graphite,
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
    alignItems: 'center'
  },
  bold: {
    fontWeight: 'bold'
  },
  image: {
    height: 75,
    width: 75,
    margin: 2.5
  },
  tagTeamImage: {
    height: 60,
    width: 60
  },
  eventName: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    paddingTop: 10
  }
})
