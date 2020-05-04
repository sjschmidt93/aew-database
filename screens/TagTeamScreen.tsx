import { observer } from "mobx-react"
import { sharedStyles } from "../styles"
import React from "react"
import { RouteProp } from "@react-navigation/native"
import { RootStackParamList } from "../App"
import { computed, observable } from "mobx"
import { ScrollView, Text } from "react-native"
import { RosterMemberList } from "./RosterScreen"
import { Match } from "../types"
import { AewApi } from "../aew_api"
import MatchList from "../components/MatchList"

type TagTeamScreenRouteProp = RouteProp<RootStackParamList, "TagTeam">
type Props = {
  route: TagTeamScreenRouteProp
}

@observer
export default class TagTeamScreen extends React.Component<Props> {
  @observable
  matches: Match[] = []
  
  @computed
  get tagTeam () {
    return this.props.route.params.tagTeam
  }

  componentDidMount() {
    this.fetchMatches()
  }
  
  fetchMatches = async () => this.matches = await AewApi.fetchTagTeamMatches(this.tagTeam.id)

  render() {
    return (
      <ScrollView style={sharedStyles.scrollViewContainer}>
        <Text style={[sharedStyles.h2, { paddingBottom: 10 }]}>Members</Text>
        <RosterMemberList members={this.tagTeam.wrestlers} />
        <Text style={sharedStyles.h2}>Matches</Text>
        <MatchList matches={this.matches} />
      </ScrollView>
    )
  }
}
