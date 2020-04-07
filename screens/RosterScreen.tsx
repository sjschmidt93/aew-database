import React from "react"
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import { observable } from 'mobx'
import { observer } from "mobx-react"
import { sharedStyles } from "../styles"
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'
import { Wrestler } from "../App"
import { navigate } from "../RootNavigation"

export const API_URL = 'http://b9293a04.ngrok.io'

export interface NavigationProp {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

const WRESTLER_ROW_HEIGHT = 75

@observer
export default class RosterScreen extends React.Component<NavigationProp> {
  @observable
  wrestlers: Wrestler[] = []

  componentDidMount() {
    this.fetchWrestlers()
  }

  fetchWrestlers = () => {
    const url = `${API_URL}/wrestlers`
    fetch(url)
      .then(res => res.json())
      .then(data => this.wrestlers = data)
  }

  onPressWrestlerRow = () => {
    // TODO: implement
  }

  render() {
    return (
      <ScrollView style={sharedStyles.scrollViewContainer}>
        <Text style={sharedStyles.h3}>AEW Roster</Text>
        <FlatList
          contentContainerStyle={styles.flatlistContentContainerStyle}
          renderItem={({item}) => <WrestlerRow wrestler={item} />}
          data={this.wrestlers}
          ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
        />
      </ScrollView>
    )
  }
}

type WrestlerRowProps = {
  wrestler: Wrestler
}

export function WrestlerRow({ wrestler }: WrestlerRowProps) {
  return (
      <View style={styles.wrestlerOuterContainer}>
      <Image style={{ height: WRESTLER_ROW_HEIGHT, width: WRESTLER_ROW_HEIGHT }} source={{ uri: wrestler.image_url }} />
      <TouchableOpacity
        style={styles.wrestlerContainer}
        onPress={() => navigate('Wrestler', { wrestler }) }
      >
        <Text style={sharedStyles.h3}>{wrestler.name}</Text>
        <Text style={sharedStyles.body}>{wrestler.nickname}</Text>
        <Text style={styles.text}>{wrestler.wins}-{wrestler.losses}</Text>
      </TouchableOpacity>
    </View>
  )
}

export const GRAPHITE = "#454343"

const styles = StyleSheet.create({
  image: {
    height: 75,
    width: 75
  },
  wrestlerOuterContainer: {
    flexDirection: 'row',
    height: WRESTLER_ROW_HEIGHT,
    alignItems: 'center',
    width: '100%',
    backgroundColor: GRAPHITE
  },
  wrestlerContainer: {
    padding: 5
  },
  flatlistContentContainerStyle: {
    flex: 1
  },
  wrestlerText: {
    color: 'white',
    fontSize: 18
  },
  text: {
    color: 'white'
  }
})