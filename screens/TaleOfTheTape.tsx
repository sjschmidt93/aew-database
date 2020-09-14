import { RouteProp } from "@react-navigation/native"
import { computed } from "mobx"
import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { RootStackParamList } from "../App"

type WrestlerScreenRouteProp = RouteProp<RootStackParamList, "TaleOfTheTape">
type Props = {
  route: WrestlerScreenRouteProp
}

export default class TaleOfTheTape extends React.Component<Props> {
  @computed
  get wrestler() {
    return this.props.route.params.wrestler
  }
  
  render() {
    return (
      <View>
        <Text>{this.wrestler.name}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({

})
