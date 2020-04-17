import React from "react"
import { Text, ScrollView } from "react-native"
import { computed, observable } from "mobx"
import { sharedStyles } from "../styles"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../App"
import { RouteProp } from "@react-navigation/native"
import { Match } from "../types"
import { observer } from "mobx-react"
import _ from "lodash"
import { MatchList } from "../components/MatchList"
import { AewApi } from "../aew_api"

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

  fetchMatches = async () => this.matches = await AewApi.fetchWrestlerMatches(this.wrestler.id)

  @computed
  get wrestler() {
    return this.props.route.params.wrestler
  }

  render() {
    return (
      <ScrollView style={sharedStyles.scrollViewContainer}>
        <Text style={sharedStyles.h2}>Match history</Text>
        <MatchList matches={this.matches} />
        <Text style={sharedStyles.h2}>Title reigns</Text>
      </ScrollView>
    )
  }
}
