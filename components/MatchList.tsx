import { View, TouchableOpacity, Text, FlatList, StyleSheet, Image } from "react-native"
import { computed } from "mobx"
import { navigate } from "../RootNavigation"
import React from "react"
import { sharedStyles, colors } from "../styles"
import { Match, Wrestler, TagTeam, MATCH_TYPE } from "../types"
import _ from "lodash"
import { navigateToRosterMember } from "../screens/RosterScreen"

type MatchListProps = {
  matches: Match[]
  wrestler?: Wrestler
  showEvents?: boolean
}

export default function MatchList({ matches, showEvents = true, wrestler }: MatchListProps) {
  return (
    <FlatList
      renderItem={({item}) => <MatchRow match={item} showEvent={showEvents} wrestler={wrestler} />}
      data={matches}
      contentContainerStyle={sharedStyles.listContainer}
    />
  )
}

type MatchRowProps = {
  match: Match
  showEvent: boolean
  wrestler?: Wrestler
}

class MatchRow extends React.Component<MatchRowProps> {
  @computed
  get match() {
    return this.props.match
  }

  @computed
  get event() {
    return this.match.event
  }

  @computed
  get sideKey() {
    return this.match.type === MATCH_TYPE.SINGLES ? "wrestlers" : "tag_teams"
  }

  render() {
    return (
      <View style={styles.matchContainer}>
        <View style={styles.container}>
          <SideWithImages side={this.match[this.sideKey][0]} match={this.match} wrestler={this.props.wrestler} />
          <Text style={sharedStyles.h2}>vs.</Text>
          <SideWithImages side={this.match[this.sideKey][1]} match={this.match} wrestler={this.props.wrestler} />
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

export function isTagTeam(side: TagTeam | Wrestler): side is TagTeam {
  return (side as TagTeam).wrestlers !== undefined
}

type SideWithImagesProps = {
  side: TagTeam | Wrestler
  match: Match
  wrestler?: Wrestler
}

class SideWithImages extends React.Component<SideWithImagesProps> {
  @computed
  get side() {
    return this.props.side
  }

  @computed
  get match() {
    return this.props.match
  }

  @computed
  get isWinner() {
    return this.match.winner === this.side.name
  }

  @computed
  get wrestlers() {
    return isTagTeam(this.side) ? this.side.wrestlers : [this.side]
  }
  
  renderImages = () => {
    const images= this.rows.map(row => <ImageRow wrestlers={row} matchType={this.match.type} />)
    const isPressable = (!isTagTeam(this.side) && this.props.wrestler?.id !== this.side.id) || (isTagTeam(this.side) && this.side.is_official)
    return isPressable
      ? (
        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={navigateToRosterMember(this.side)}
        >
          { images }
        </TouchableOpacity>
      )
      : (
        <View style={{ alignItems: "center" }}>
          { images }
        </View>
      )
    }

  @computed
  get rows(): Wrestler[][] {
    return _.chunk(this.wrestlers, this.wrestlers.length <= 4 ? 2 : 3)
  }

  render () {
    return (
      <View style={styles.wrestlerContainer}>
        {this.renderImages()}
        <Text style={sharedStyles.body}>{this.side.name}</Text>
        <Text style={[styles.bold, { color: this.isWinner ? 'green' : 'red' }]}>{ this.isWinner ? "WIN" : "LOSS" }</Text>
      </View>
    )
  }
}

const SINGLES_MATCH_IMAGE_DIM = 75
const TAG_MATCH_IMAGE_DIM = 60

function ImageRow({ wrestlers, matchType }: { wrestlers: Wrestler[], matchType: MATCH_TYPE }) {
  const dim = matchType == MATCH_TYPE.SINGLES ? SINGLES_MATCH_IMAGE_DIM : TAG_MATCH_IMAGE_DIM
  const imageStyle = {
    height: dim,
    width: dim,
    marginRight: 5
  }
  return (
    <View style={{ flexDirection: "row", paddingBottom: 5 }}>
      { wrestlers.map(wrestler => <Image style={imageStyle} source={{ uri: wrestler.image_url }} />) }
    </View>
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
