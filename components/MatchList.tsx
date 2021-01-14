import { View, TouchableOpacity, Text, FlatList, StyleSheet } from "react-native"
import { computed } from "mobx"
import { navigate, push } from "../RootNavigation"
import React from "react"
import { sharedStyles, colors } from "../styles"
import { Match, Wrestler, TagTeam, MatchType } from "../types"
import _ from "lodash"
import GoToModal from "../GoToModal"
import { observer } from "mobx-react"
import { RosterMember } from "../screens/RosterScreen"

type MatchListProps = {
  matches: Match[]
  wrestler?: Wrestler
  tagTeam?: TagTeam
  showEvents?: boolean
}

export default function MatchList({ matches, showEvents = true, wrestler, tagTeam }: MatchListProps) {
  return (
    <FlatList
      renderItem={({item}) => (
        <MatchRow
          match={item}
          showEvent={showEvents}
          wrestler={wrestler}
          tagTeam={tagTeam}
        />
      )}
      data={matches}
      contentContainerStyle={sharedStyles.listContainer}
      keyExtractor={(item, index) => index.toString()}
    />
  )
}

type MatchRowProps = {
  match: Match
  showEvent: boolean
  wrestler?: Wrestler
  tagTeam?: TagTeam
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
    return this.match.type === MatchType.SINGLES ? "wrestlers" : "tag_teams"
  }

  render() {
    return (
      <View style={styles.matchContainer}>
        <View style={styles.container}>
          <SideWithImages
            side={this.match[this.sideKey][0]}
            match={this.match}
            wrestler={this.props.wrestler}
            tagTeam={this.props.tagTeam}
          />
          <Text style={sharedStyles.h2}>vs.</Text>
          <SideWithImages
            side={this.match[this.sideKey][1]}
            match={this.match}
            wrestler={this.props.wrestler}
            tagTeam={this.props.tagTeam}
          />
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
  tagTeam?: TagTeam
}

@observer
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
    return !_.isNil(this.side) && isTagTeam(this.side) ? this.side.wrestlers : [this.side]
  }

  @computed
  get members(): RosterMember[] {
    if (!isTagTeam(this.side)) {
      return this.wrestlers
    } else {
      const filteredWrestlers = Array.from(this.wrestlers)
      this.side.sub_teams.forEach(subTeam => {
        subTeam.wrestlers.forEach(wrestler => {
          const index = filteredWrestlers.findIndex(w => wrestler.id === w.id)
          if (index > -1) {
            filteredWrestlers.splice(index, 1)
          }
        })
      })
      return [...this.side.sub_teams, ...filteredWrestlers]
    }
  }

  @computed
  get rows(): Wrestler[][] {
    return _.chunk(this.wrestlers, this.wrestlers.length <= 4 ? 2 : 3)
  }

  @computed
  get body() {
    return (
      this.members.map((member, index) => {
        const isBold = this.props.wrestler?.name === member.name || this.props.tagTeam?.name === this.side.name
        return (
          <Text
            key={`member-${index}`}
            style={[
              sharedStyles.body,
              { textAlign: "center" },
              isBold && { fontWeight: "bold", fontSize: 13 },
            ]}
          >
            {member.name}
          </Text>
        )
      })
    )
  }

  render () {
    const isPressable = isTagTeam(this.side) || this.props.wrestler?.id !== this.side.id
    const onPress = () => {
      if (isTagTeam(this.side) && !_.isNil(this.side)) {
        // filter out the wrestler whose page is currently displayed
        const wrestlers = this.side?.wrestlers.filter(wrestler => wrestler.id !== this.props.wrestler?.id)
        let items: RosterMember[] = [...this.side.sub_teams, ...wrestlers]
        if (this.side.is_official) {
          items.unshift(this.side)
        }
        GoToModal.show(items)
      } else {
        push("Wrestler", { wrestler: this.side })
      }
    }
    
    return (
      <View style={styles.wrestlerContainer}>
        { isPressable ? (
          <TouchableOpacity onPress={onPress}>
            {this.body}
          </TouchableOpacity>
        ) : this.body }
        <Text style={[styles.bold, { color: this.isWinner ? 'green' : 'red' }]}>{ this.isWinner ? "WIN" : "LOSS" }</Text>
      </View>
    )
  }
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
