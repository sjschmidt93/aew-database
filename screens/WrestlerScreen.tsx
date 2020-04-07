import React from "react"
import { Text, ScrollView, StyleSheet, FlatList, View } from "react-native"
import { computed, observable } from "mobx"
import { sharedStyles } from "../styles"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../App"
import { RouteProp } from "@react-navigation/native"
import { WrestlerRow, API_URL } from "./RosterScreen"
import { Match } from "../types"
import { observer } from "mobx-react"

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

  renderMatch = ({item}) => (
    <View>
      <Text style={sharedStyles.body}>{item.wrestlers[0].name} vs. {item.wrestlers[1].name}</Text>
    </View>
  )
  

  render() {
    console.log(this.matches)
    return (
      <ScrollView style={sharedStyles.scrollViewContainer}>
        <WrestlerRow wrestler={this.wrestler} />
        <Text style={sharedStyles.h2}>Match history</Text>
        <FlatList
          renderItem={this.renderMatch}
          data={this.matches}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({

})